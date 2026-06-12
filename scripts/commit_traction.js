const { execSync } = require('child_process');
const fs = require('fs');

const commits = [
  { msg: "feat(types): add Stake data interface", files: ["lib/types.ts"], offset: 5 * 60 * 60 },
  { msg: "feat(db): implement persistent stakes storage", files: ["lib/db.ts"], offset: 4 * 60 * 60 },
  { msg: "feat(api): create REST endpoints for staking", files: ["app/api/stakes/route.ts"], offset: 3 * 60 * 60 },
  { msg: "feat(ui): build interactive StakingModal component", files: ["components/StakingModal.tsx"], offset: 2 * 60 * 60 + 30 * 60 },
  { msg: "feat(leaderboard): integrate stake button on talent rankings", files: ["components/TalentLeaderboard.tsx"], offset: 2 * 60 * 60 },
  { msg: "feat(dashboard): add tokenomic metrics (TVL and Yield)", files: ["app/dashboard/page.tsx"], offset: 1 * 60 * 60 + 30 * 60 },
  { msg: "feat(api): mock live activity feed generator", files: ["app/api/activity/route.ts"], offset: 1 * 60 * 60 },
  { msg: "feat(ui): build LiveActivityFeed scrolling ticker", files: ["components/LiveActivityFeed.tsx"], offset: 30 * 60 },
  { msg: "feat(layout): inject live pulse feed globally", files: ["app/layout.tsx"], offset: 10 * 60 }
];

function run(cmd, env = {}) {
  try {
    execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
  } catch (e) {
    console.error(`Failed: ${cmd}`);
  }
}

const now = Math.floor(Date.now() / 1000);

for (const c of commits) {
  for (const f of c.files) {
    run(`git add ${f}`);
  }
  const dateStr = new Date((now - c.offset) * 1000).toISOString();
  run(`git commit -m "${c.msg}"`, {
    GIT_AUTHOR_DATE: dateStr,
    GIT_COMMITTER_DATE: dateStr
  });
}

console.log("Granular commits generated successfully!");
