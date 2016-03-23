
`master` 分支是用来发布稳定的版本。

`develop` 分支从 `master` 中分出,用在开发的时候远程存储，在项目建立的时候将项目存储在该分支中，开发途中不与 `master` 分支做自己接合并。

`feature` 分支是在开发新功能的时候，从 `develop` 中分出来做独立分支进行开发，该功能不满意可直接废弃，该功能开发完成后与 `develop` 进行合并。

`release` 分支从 `develop` 中分出，主要负责项目所需要的各项说明（版本号、发布时间、编译时间等七七八八的）做项目发布前的准备，还可以避免须后开发的不稳定因素，让 `develop` 分支处于持续开发的状态，当然 `release` 分支在做项目说明的同时发现bug是可以做直接修复的。

`hotfix` 分支从`master` 中分出，当正式版发现异常情况，严重到必须立即修复的软件缺陷的时候，分出 `hotfix` 分支做紧急修复处理。

这样的分工使得 `开发->文档->bug->上线` 分别独立修改时互不影响，多线程机制，感觉屌屌的。

有人带着学习好东西就是不一样，原先工作的项目划分真的跟狗屎一样，正式测试开发用着同一个项目，各种问题，分开好几个文件管理，还是乱的不要不要的，自己想解决方案远没有直接get一个成熟的方案来的靠谱。

git的分支系统的使用 - get新技能（人物等级+1 ^.^）。

```
git branch dev
```
创建分支

```
git checkout -b dev
```
切换分支

```
git checkout -b dev
```
创建分支并切换分支

```
vim test.js
git add test.js
git commit -m "add test.js"
```
在 `dev` 分支下创建了 `test.js`, 并提交后，使用 `git checkout master` 切换到 `master` 分支，发现并没有 `test.js`这个文件和相关内容。
神奇吧，他跑去哪了？这个现象说明他们存在两个不同的空间中，互不影响，有了这个东西我们对代码的管理似乎方便了许多是吧。

那么问题来了，如果没有使用 `commit`，直接切换会发生什么呢？我做了一个尝试：

```
error: Your local changes to the following files would be overwritten by checkout:
	test.js
Please, commit your changes or stash them before you can switch branches.
Aborting
```
控制台告诉我，我有东西修改，没有提交，也没有隐藏，所以不让我切换。
之后在试试 `commit` 下，发现还是不能切换分支。
结果切换了，刚刚 `commit` 的内容不存在了，噢~~
这不是很明显了吗，是 `commit` 让 `test.js` 独立在 `dev` 分支中。

# 想象下，他们就是分别存在两个空间中吗？ `commit` 是如何做到这一步的呢？？？

- 在当前目录下新建了`test.js`文件，并添加到本地仓库，现在 `dev` 分支移动了一格，而 `master` 分支还指向原来的 `commit` 对象，`test.js` 文件只属于 `dev` 分支，`master` 分支并没有该文件。
现在切换到 `master` 分支
- `Git` 会把工作目录的内容恢复为检出某分支时它所指向的那个提交对象的快照，它会自动添加、删除和修改文件以确保目录的内容和你当时提交时完全一样。

这时候就出要说 `commit` 本地仓库了，到底是怎么一回事，我现在也不太清楚呢。。。

```
git merge dev
```
合并分支 `ps:需切换到master分支`

合并时出现了“Fast-forward”的提示，因为当前master分支所在的提交对象是要并入的分支dev的直接上游，换句话说，如果顺着一个分支直走下去可以到达另一分支的话，合并两者时不存在任何需要解决的分歧，只需简单的移动指针，这种合并过程称为“Fast-forward”。如果当前master分支所指向的提交对象不是dev分支的直接祖先，Git需要做一些额外处理，Git会用两个分支的末端和它们的共同祖先进行一次简单的三方合并，并做一个新的快照，自动创建一个指向它的提交对象。这个对象有两个祖先，即之前两个分支的末端。合并之后，dev分支和master分支指向同一位置，master分支指向的提交对象就是最新的修改了。

如果不同分支修改了同一文件，合并时可能会遇到冲突，此时Git做了合并，但是并没有提交。使用git status查看哪些文件发生了冲突。解决了所有的冲突后，执行git add将它们添加到暂存区域，因为一旦暂存就表示冲突已解决，然后使用git commit完成这次合并的提交。

```
git branch -d dev
```
删除分支

```
git branch
 
dev
* master
```
列出当前所有分支的清单 `*字符：表示当前所在的分支`

```
git branch -v
 
* dev f901e67 test
  master  db136e5 test
```
 查看各个分支最后一个提交对象的信息
 
```
git branch --merged
 
dev
* master
```
查看已经与当前分支合并的分支

```
git branch --no-merged
```
查看已经与当前分支未合并的分支，在 `master` 下使用该命令时时显示 `dev`; 在 `dev` 下使用该命令时没有消息显示


```
origin/HEAD -> origin/master
origin/master
```
查看远程分支

```
git push origin dev
git branch -r
 
origin/HEAD -> origin/master
origin/dev
origin/master
```
创建远程分支,即把本地分支推送到远程，可以看到已把dev分支成功push到服务器上

```
git fetch origin
```
同步远程服务器上的数据到本地

```
git checkout --track origin/dev
```
跟踪远程分支,从远程拉取dev分支到本地，并切换到dev分支

```
git checkout -b develop origin/dev
```
从远程拉取dev分支到本地,命名为develop，并切换到develop分支

```
git push origin dev:dev
```
提交本地分支数据到远程服务器 `git push origin local:remote`, 如果当前是在dev分支下工作，可直接git push

```
git push origin :dev
```
删除远程分支，因为和创建分支，提交分支很相似，开始的时候就用错了，把分支给删了，这里一定要特别注意。

```
git checkout dev
git rebase master
```
分支的衍合

把一个分支整合到另一个分支有两种方法：merge和rebase（衍合）
前面已经介绍过，merge是把两个分支最新的快照和二者最新的共同祖先进行三方合并，产生一个新的提交对象。rebase是回到两个分支的共同祖先，根据要进行衍合的分支dev的历次提交对象，生成一系列文件补丁，然后以主干分支master的最后一个提交对象为新的出发点，逐个应用dev分支准备好的补丁文件，生成一个新的提交对象，改写dev的提交历史，使dev成为master的直接下游。然后回到master分支，进行一次快进合并。这样能够保持更加清晰的提交记录，就像没有使用过分支一样。

ps:可以把衍合当作一种在推送之前清理提交历史的手段，如果分支中的提交对象已经发布到服务端，就千万不要对该分支进行衍合。

以上来自：[懒人部落阁](http://codingnow.cn/)
原文地址：`http://codingnow.cn/version/228.html`


### 2016-03-23 操作git分支小结

上次学习了git简单分支操作指令，今天玩玩看如何将创建的分支与祖分支合并。

```
git checkout develop
git branch test
git checkout test
```
首先我们进入 `develop` 分支下创建了 `test` 分支，并进入 `test` 分支。
这时候和预期的一样，在 `test` 分支下有一份 `develop` 相同的项目。

这时候我们操作 `test` 分支创建一个 `test.md` 文件，对其添加一些简单的数据 `helloworld`。

```
git checkout develop
```
我们切回 `develop` 分支，发现他同样有这个文件，里面的内容也是 `helloworld`.

```
git checkout test
git add test.md
git checkout develop

A	test.md
Switched to branch 'develop'
```
这时我们切回 `test` 分支，将 `test.md` 使用 `git add` 操作一遍，在回到 `develop`。
这时系统提示我们说 `A	test.md` 表示这个文件是处于 `add` 状态的。这个时候两边的文件都是 `add`状态。

```
git checkout test
git commit -m 'test.md'
git checkout develop
```
那我们在切换回 `test` 分支，使用 `git commit` 将文件提交到本地仓库，在切换回 `develop` 分支，神奇的发现 `test.md` 文件不见了？
我们在回去 `test` 看看，文件是否是在 `test` 分支中。

```
git checkout test
```
这是我们会发现 `test.md` 文件是存在的。也就是说，当我们在使用 `git commit` 命令时，添加到本地仓库的文件只属于 `test` 分支。
而我们回去 `develop` 分支，Git会将工作目录回复上次提交的状态，具体如何操作的善未可知。

这时候我们将刚刚提交的内容 `git push` 到远程仓库中。
```
git push origin test:test

 * [new branch]      test -> test
```
新建了一个远程仓库，并将我们所提交的内容添加到了远程仓库。我们在远程仓库中可以看到我们提交的内容。
那么现在我们来合并下两个分支。

```
git checkout develop
git merge test

Updating ae291bd..56ff540
Fast-forward
 test.md | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 test.md
```
可以看到，在 `develop` 分支下加入了新的东西 `test.md` 就是我们刚提交的内容。
那么远程分支会不会有这个新东西呢？观察后发现，远程分支是没有 `test.md` 这个文件的。

```
git status
```
查看Git的状态也没有发现 `test.md` 文件的信息。
如果本地仓库是有 `test.md` 文件的话，我们将本地仓库推入远程仓库，看看操作后远程仓库是否有该文件。

```
git push origin develop:develop
```
push后发现，远程仓库多出了一个 `test.md` 文件，简单的分支合并就完成了。
那么问题来了，如果两个分支同时操作 `test.md` 文件会发生什么事情呢？

```
git add test.md
git commit -m 'test.md'
git checkout test
git add test.md 
git commit -m 'test-test.md'

Auto-merging test.md
CONFLICT (content): Merge conflict in test.md
Automatic merge failed; fix conflicts and then commit the result.
```
我们修改两个 `test.md` 给入不同数据，提交后，先在本地合并。
系统提示，自动合并失败，两个文件有冲突，需要解决冲突后提交结果。

```
git add test.md
git commit -m 'test.md'
git push origin develop:develop
```
修改冲突后，提交到远程仓库，这个时候两个分支的数据就同步了。所以对于冲突，Git已经帮我们做好解决方案了。

简单的Git分支操纵入门篇。
作者：Bert。

小白初学记录，如有错误的地方，倾听大神们的指教 ^_^.











