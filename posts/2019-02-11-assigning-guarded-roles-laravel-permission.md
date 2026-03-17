---
title: "laravel-permissionでguardつきroleをアサインする"
date: 2019-02-11 15:16:21
---

たまには（すんげぇピンポイントな）技術ネタを。

一般的にLaravel-permissionsを用いてdb:seedを行う際、Seederの中でassignRoleする方法は、以下の通り。

        $user = User::create(\[

'name' => '社長',
'email' => 'owner@localhost',
'password' => Hash::make('owner'),
\]);
$user->assignRole('owner');

[この辺とか参考に。](https://qiita.com/beeete2/items/0cb2ee0e6341c9be7075#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%97%E3%83%AD%E3%83%BC%E3%83%AB%E3%82%92%E5%89%B2%E3%82%8A%E5%BD%93%E3%81%A6%E3%82%8B)

なんですけど、assignRole関数はguardを受け取らない仕様になっている。（2019/02現在）

これでは、guardを使って例えばAPI経由の時だけパーミッション参照させたい場合などに困る。

[この辺とか](https://github.com/spatie/laravel-permission/blob/master/src/Traits/HasRoles.php#L97) [この辺の実装](https://github.com/spatie/laravel-permission/blob/master/src/Traits/HasRoles.php#L259)を見てみると、`getDefaultGuardName()`でデフォルトの奴しか参照してない。ダメだこりゃ。

正解としては、[このIssue](https://github.com/spatie/laravel-permission/issues/565#issuecomment-346877726)の通りなんだけど、本当に最低限（チェックとか省いた）バージョンは以下でいいのかなと思います。

    $roles = app(Role::class)->findByName('owner', 'apiguard');

$user->roles()->saveMany($roles);
$user->forgetCachedPermissions();

roleとかguardの存在確認とか省いてしまっているので、ご参考程度までに。

Laravel使い始めて５ヶ月ほどですけど、ほんと内部のソース読み込まないと使いこなせませんね。
