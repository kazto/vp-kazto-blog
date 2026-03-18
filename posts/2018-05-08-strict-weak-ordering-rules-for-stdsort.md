---
title: "std::sortに渡す比較関数の「Strict Weak Ordering」ルールについて"
date: 2018-05-08 23:11:22
tags: [tech, cpp, algorithm]
---

ここのところの仕事の中で、vectorを一定の（しかし単なる大小比較ほどシンプルじゃないルールで）ソートする必要があり、コーディングしていました。

差し支えない程度にざっくり言うと、(x, y)座標の点を表す構造体があり、それを左上から右下へ並べ替えます。その時に、一定の閾値以下のズレはないものとして扱う、イコールとする、という仕掛けを入れたかったのです。

せっかくSTL使ってるんだから、ソートもSTLのやつを使えばいいじゃんということで、std::sortを使うことにしました。イメージとして、[RubyのArray::sort](https://docs.ruby-lang.org/ja/latest/method/Array/i/sort.html)、ブロック付きのやつが頭にあり、そんな雰囲気でstd::sortを使うつもりでいました。

サクサクとつくり、実際動かしてみたところ、Assertが発生しました。曰く「invalid comparator」。理由がわからず検索をかけてみたところ、[StackOverflowの記事](https://stackoverflow.com/questions/32263560/errorinvalid-comparator-when-sorting-using-custom-comparison-function)に行き当たり、比較関数は「Strict Weak Ordering」なるルールに従う必要があるとのこと。

これが、[Wikipedia](https://en.wikipedia.org/wiki/Weak_ordering)や[ここ](http://d.hatena.ne.jp/Cryolite/20040529)や[ここ](http://d.hatena.ne.jp/prettysoft/20101125/1490423346)を読んでもさっぱりピンとこなかったのです。

なんとか理解したものを噛みくだくと、比較関数 comp(a, b) は以下の3点を守る必要がある、ということ。

> - すべての場合において、comp(a,a) が false となること
> - comp(a,b) が true のとき、comp(b,a) が必ず false になること
> - comp(a,b) が true かつ comp(b,c) が true のとき、comp(a,c) が必ず true になること

最終的に、[ここ](http://en.cppreference.com/w/cpp/concept/Compare)の記述に行きつき、腑に落ちた次第。

なんでもVisualStudioはデバッグビルド時にこのルールをチェックして、違反する場合にアサート飛ばしてくれるんだそうな。VisualStudioさまさま。
