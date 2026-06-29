---
title: "Codex bwrap サンドボックスエラーの解決手順覚え書き"
date: 2026-06-29
tags: ["codex", "bubblewrap", "bwrap", "sandbox"]
description: "Codex bwrap サンドボックスエラーの解決手順覚え書き"
---

# Codex bwrap サンドボックスエラーの解決手順覚え書き

> この記事はおおむねAIに書いてもらい、表現のみ手直ししました。スロップかな。。。

## 症状

Codex がコマンドを実行しようとすると、対象コマンドが起動する前に失敗することがよくあります。

```text
bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted
```

だいたい、実行しても差し支えないようなコマンドでもこれは発生します。

```bash
date
rg --files
uname -a
```

## 原因

Linux/WSL2 環境では、Codex はサンドボックス内でコマンドを実行するために `bubblewrap`（`bwrap`）を使用します。このエラーは、`bwrap` がサンドボックスのネットワーク名前空間内でループバックアドレスを設定できなかったことを意味し、通常はユーザー名前空間または AppArmor のサポートが存在しないか制限されていることが原因でした。

## 適用した修正

`bubblewrap` をインストールする:

```bash
sudo apt update
sudo apt install -y bubblewrap
```

Ubuntu 24.04 系の AppArmor 制限環境では、`bwrap-userns-restrict` プロファイルをインストールして読み込む:

```bash
sudo apt install -y apparmor-profiles apparmor-utils
sudo install -m 0644 \
  /usr/share/apparmor/extra-profiles/bwrap-userns-restrict \
  /etc/apparmor.d/bwrap-userns-restrict
sudo apparmor_parser -r /etc/apparmor.d/bwrap-userns-restrict
```

プロファイルを適用した後、Codex を再起動する。

## 確認

Codex のサンドボックス実行で簡単なコマンドを実行する:

```bash
date
rg --files
uname -a
```

これらのコマンドが正常な出力を返し、`bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted` エラーが表示されなくなれば修正完了です。
