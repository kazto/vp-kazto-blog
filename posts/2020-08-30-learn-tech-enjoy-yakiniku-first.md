---
title: "技術を教わって、焼肉をごちそうする会、第一回。"
date: 2020-08-30 09:01:19
tags: [tech, kubernetes, community]
---

[![](https://assets.blog.kazto.dev/images/2021/01/joseph-barrientos-eUMEWE-7Ewg-unsplash-300x200.jpg)](https://assets.blog.kazto.dev/images/2020/0829/joseph-barrientos-eUMEWE-7Ewg-unsplash.jpg "joseph-barrientos-eUMEWE-7Ewg-unsplash.jpg")

Photo by [Joseph Barrientos](https://unsplash.com/@jbcreate_?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

2か月ぶりのブログ。

最近、Kubernetesが気になっています。今さら。

ですが、記事をいろいろ読み漁っていても、イマイチピンと来ないというか、どうやったら弊社環境に当てはめることができるんだろう、というのが課題でした。

そこで、ふと見たTLに焼肉をごちそうすることで有名なすえなみさんが流れてきて、思いました。

> 「二番煎じ、イケる・・・！（邪悪な笑み」

そこで、つぶやきました。

> 焼き肉おごるから、誰かKubernates教えてほしい
>
> — kazto / 自社サの何でも屋 (@bainarian) [August 6, 2020](https://x.com/bainarian/status/1291377120787144705?ref_src=twsrc%5Etfw)

これに手を挙げてくださったのが、[やっしーさん](https://x.com/yasshi2525)。

昨今会食は控えようということになり、ご教授いただく部はリモートでの開催となりました。焼き肉をご馳走する部は後日。

結論、以下のような所感。

- ローカルで使うものでは、全くない。
- AWSに載せることを考えたら、開発環境や本番環境をひとまとめに管理できて良さそう。
- やっぱ気軽にスケールアップダウンしたいよね。
- ダッシュボードいいね。
- セキュリティはちょっと考えないといかんね。
- ストレージのことは知らなかった。勉強になりました。

すえなみチャンスをパクってみて(笑)、対価とともに知識を得るって実はとてもWin-Winなのではないか、と思えてきました。すえなみチャンス、とてもいいものですね。皆さんも気軽に教わってみてはいかがでしょうか。
