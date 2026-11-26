// 接続のたびに、START.md（キーの確認結果とプレビューのリンク）を前面に開く。
// プレビューのサーバーが立ち上がるとシンプルブラウザーが自動で開き（onAutoForward: openPreview）、
// 先に開いたSTART.mdの前に出てしまう。そのため、サーバーの応答を待ってから少し間をおいて開く。
// シンプルブラウザーが開く時刻は分からないため、2回開く（開いているファイルを開き直しても前に出るだけ）。
// openFiles ではテキストのまま開くため使わない。code コマンドは workbench.editorAssociations に従う。
import { execFileSync } from 'node:child_process';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const open = () => {
  try {
    execFileSync('code', ['START.md'], { stdio: 'ignore' });
  } catch {
    // code コマンドが使えない環境（ブラウザー以外から接続など）では何もしない
  }
};

for (let i = 0; i < 60; i++) {
  try {
    await fetch('http://localhost:3000/', { signal: AbortSignal.timeout(1000) });
    break;
  } catch {
    await sleep(1000);
  }
}
await sleep(4000);
open();
await sleep(8000);
open();
