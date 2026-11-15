const {PGlite}=require('@electric-sql/pglite'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const ids=['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333'];
(async()=>{
const db=new PGlite();
await db.exec(`create schema auth;create role authenticated;create role anon;create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('test.uid',true),'')::uuid$$;
grant usage on schema auth to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;
create table test_friends(a uuid,b uuid);
create function public.examlab_beta_overview() returns jsonb language sql stable security definer as $$select jsonb_build_object('friends',coalesce(jsonb_agg(jsonb_build_object('user_id',case when a=auth.uid() then b else a end,'name','Bạn thử nghiệm')),'[]'::jsonb)) from test_friends where a=auth.uid() or b=auth.uid()$$;
create table examlab_attempts(owner_id uuid,id text,completed_at timestamptz,payload jsonb,primary key(owner_id,id));
grant select,insert,update,delete on examlab_attempts to authenticated;
alter table examlab_attempts enable row level security;create policy test_owner on examlab_attempts to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());`);
const studySetup=fs.readFileSync(path.join(__dirname,'../docs/SETUP_STUDY_SYNC_V15.sql'),'utf8');
await db.exec(studySetup);await db.exec(studySetup);
for(const id of ids)await db.query('insert into auth.users values($1)',[id]);
const sql=fs.readFileSync(path.join(__dirname,'../docs/SETUP_STREAK_V30.sql'),'utf8');
await db.exec(sql);await db.exec(sql);
async function as(i){await db.exec('reset role');await db.query("select set_config('test.uid',$1,false)",[ids[i]||'']);await db.exec('set role authenticated')}
async function rpc(fn,args=[],types=[]){return(await db.query(`select public.${fn}(${args.map((_,i)=>'$'+(i+1)+(types[i]?'::'+types[i]:'')).join(',')}) v`,args)).rows[0].v}
async function denied(fn){let failed=false;try{await fn()}catch{failed=true}assert(failed,'Expected rejection')}
const snapshot=()=>rpc('examlab_v30_streak_snapshot');
const study=(id,ms=600000,offset='0 days',user=ids[0],mode='stopwatch')=>db.query('insert into examlab_study_sessions(user_id,id,study_at,duration_ms,mode) values($1,$2,now()+$3::interval,$4,$5) on conflict(user_id,id) do update set duration_ms=excluded.duration_ms,study_at=excluded.study_at',[user,id,offset,ms,mode]);
for(let round=1;round<=5;round++){
await db.exec('reset role;truncate examlab_streak_credits,examlab_streak_preferences,examlab_study_sessions,examlab_attempts,test_friends');await db.query('insert into test_friends values($1,$2)',ids.slice(0,2));
await as(0);let s=await snapshot();assert.equal(s.my.current,0);assert.equal(s.sharing,false);assert.equal(s.friends[0].visible,false);assert(!s.friends[0].personal);
await study('part-a',300000);assert.equal((await snapshot()).my.today_done,false);await study('part-a',300000);assert.equal((await snapshot()).my.seconds_today,300);await study('part-b',300000);s=await snapshot();assert.equal(s.my.current,1);assert.equal(s.my.today_done,true);assert.equal(s.my.seconds_today,600);
await study('old-offline',600000,'-2 days');await study('future',600000,'2 days');await denied(()=>study('break',600000,'0 days',ids[0],'break'));assert.equal((await snapshot()).my.total,1);
await denied(()=>study('fake',600000,'0 days',ids[1]));await denied(()=>db.query('select * from examlab_streak_credits'));await denied(()=>db.query('select * from examlab_streak_preferences'));await denied(()=>rpc('examlab_v30_days',[ids[1]]));await denied(()=>rpc('examlab_v30_stats',[[], '2026-11-13'],['date[]','date']));await denied(()=>rpc('examlab_v30_ingest',['study',{},true],['text','jsonb','boolean']));
await rpc('examlab_v30_streak_sharing',[true]);s=await snapshot();assert.equal(s.sharing,true);assert.equal(s.friends[0].visible,false);
await as(1);await study('peer',600000,'0 days',ids[1]);await rpc('examlab_v30_streak_sharing',[true]);s=await snapshot();assert(s.friends[0].visible);assert.equal(s.friends[0].duo.current,1);assert(s.friends[0].duo.today_done);
await as(2);assert.equal((await snapshot()).friends.length,0);await denied(()=>db.query('select * from examlab_streak_credits where user_id=$1',[ids[0]]));
await as(0);await db.query('delete from examlab_study_sessions where user_id=$1',[ids[0]]);assert.equal((await snapshot()).my.current,1);await study('part-a',600000);assert.equal((await snapshot()).my.total,1);
await db.exec('reset role');await db.query("insert into examlab_streak_credits values($1,'study','yesterday',(now() at time zone 'Asia/Ho_Chi_Minh')::date-1,600,now())",[ids[0]]);
await db.query("insert into examlab_streak_credits values($1,'study','yesterday',(now() at time zone 'Asia/Ho_Chi_Minh')::date-1,600,now())",[ids[1]]);
await as(0);assert.equal((await snapshot()).my.current,2);assert.equal((await snapshot()).friends[0].duo.current,1);
await rpc('examlab_v30_streak_sharing',[false]);s=await snapshot();assert(!s.friends[0].visible);assert(!s.friends[0].duo);assert.equal(s.my.current,2);
await as(1);assert(!(await snapshot()).friends[0].visible);
await db.exec('reset role');await db.query("update examlab_streak_preferences set enabled_since=now()-interval '10 days'");
await as(0);await rpc('examlab_v30_streak_sharing',[true]);assert.equal((await snapshot()).friends[0].duo.current,1,'Re-enabling sharing starts a new period');
await db.exec('reset role;delete from test_friends');await as(0);assert.equal((await snapshot()).friends.length,0);
// Validate exam thresholds independently of previous credits.
await as(2);const attempt=async(id,questions,unanswered,time)=>db.query('insert into examlab_attempts values($1,$2,now(),$3::jsonb)',[ids[2],id,JSON.stringify({questionIds:Array.from({length:questions},(_,i)=>i),unanswered,timeUsedSec:time})]);
await attempt('short',5,0,59);await attempt('few',5,1,60);await attempt('malformed',5,'bad',60);assert.equal((await snapshot()).my.total,0);await attempt('eligible',5,0,60);assert.equal((await snapshot()).my.total,1);
// Deterministic date logic: retain yesterday, reset on a gap, dedupe, ignore future.
await db.exec('reset role');
let stats=await rpc('examlab_v30_stats',[['2026-11-09','2026-11-10','2026-11-11','2026-11-12','2026-11-12','2026-12-01'],'2026-11-13'],['date[]','date']);assert.equal(stats.current,4);assert.equal(stats.best,4);assert.equal(stats.today_done,false);assert.equal(stats.total,4);
stats=await rpc('examlab_v30_stats',[['2026-11-09','2026-11-10','2026-11-11'],'2026-11-13'],['date[]','date']);assert.equal(stats.current,0);assert.equal(stats.best,3);
stats=await rpc('examlab_v30_stats',[['2026-11-09','2026-11-10','2026-11-12','2026-11-13'],'2026-11-13'],['date[]','date']);assert.equal(stats.current,2);assert.equal(stats.week,4);assert.equal(stats.days.length,4);
assert.equal((await db.query("select ('2026-11-12T17:00:00Z'::timestamptz at time zone 'Asia/Ho_Chi_Minh')::date::text d")).rows[0].d,'2026-11-13');
assert.equal((await db.query("select ('2026-11-12T16:59:59Z'::timestamptz at time zone 'Asia/Ho_Chi_Minh')::date::text d")).rows[0].d,'2026-11-12');
// Backfill old history exactly once and prevent moving an old event into today.
await db.query("select examlab_v30_ingest('study',jsonb_build_object('user_id',$1::text,'id','historic','study_at',now()-interval '10 days','duration_ms',600000,'mode','focus'),true)",[ids[0]]);
await db.query("select examlab_v30_ingest('study',jsonb_build_object('user_id',$1::text,'id','historic','study_at',now(),'duration_ms',600000,'mode','focus'),true)",[ids[0]]);
assert.equal((await db.query("select count(*)::int n from examlab_streak_credits where source_id='historic' and study_day=(now() at time zone 'Asia/Ho_Chi_Minh')::date-10")).rows[0].n,1);
await db.query("select examlab_v30_ingest('study',jsonb_build_object('user_id',$1::text,'id','bad','study_at','not-a-date','duration_ms',600000,'mode','focus'),true)",[ids[0]]);
await db.exec('set role anon');await denied(snapshot);await denied(()=>rpc('examlab_v30_streak_sharing',[true]));await as(-1);await denied(snapshot);
console.log(`PASS V30 SQL round ${round}: thresholds, deduplication, backfill, VN midnight, gaps, privacy/opt-in, duo, unfriend, deletion, RLS, anonymous`);
}
await db.close();
})().catch(e=>{console.error(e);process.exit(1)});
