// Codespaceごとのプレビューのリンクと、キーの確認結果を載せた START.md を作る。
// プレビューのURLはCodespaceごとに違うため、環境変数から組み立てる。
// キーは後から直されることがあるため、Codespaceを開くたび（postStartCommand）に作り直す。
import { writeFile } from 'node:fs/promises';
import { checkKey } from './check-key.mjs';

const port = 3000;
const name = process.env.CODESPACE_NAME;
const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;

const key = await checkKey();
const keyLine = {
  ok: key.usable
    ? '**キーの確認：OK**'
    : '**キーの確認：OK**（Claude Code は最初の授業から使えるようになります）',
  missing: '**キーの確認：キーが登録されていません。** 手順書の「困ったとき」を見てください。',
  format: '**キーの確認：キーが正しくありません。** 手順書の「困ったとき」を見てください。',
  invalid: '**キーの確認：キーが正しくありません。** 手順書の「困ったとき」を見てください。',
  unknown: '**キーの確認：確認できませんでした。** 通信の状態を確かめ、Codespace を開き直してください。',
}[key.status];
console.log(`キーの確認：${key.status}${key.usable ? '（使用可）' : ''}`);

const previewStep = name && domain
  ? `1. [プレビューを開く](https://${name}-${port}.${domain}/)を押します。ブラウザーの別タブでプレビューが開きます（このとき、プレビューを見るための確認が済みます）。`
  : '1. 下の「ポート」タブで「プレビュー」の行の地球儀のアイコンを押します。ブラウザーの別タブでプレビューが開きます。';

const page = `# はじめに

${keyLine}

${previewStep}
2. このVS Codeのタブに戻り、上の「シンプル ブラウザー」のタブを選んで、↻（更新）を押します。VS Codeの中にプレビューが表示されます。
3. 画面右下の「✻ Claude Code」を押すと、右側にClaude Codeが開きます。
4. このページ（START.md）のタブは閉じて構いません。もう一度見たいときは、左の一覧から開けます。

プレビューが表示されなくなったら、もう一度 1 と 2 を行ってください。
`;

await writeFile(new URL('../START.md', import.meta.url), page);
