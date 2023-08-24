+++
title = "Arch repository hosted on Github"
date = 2023-08-24
+++

This article is a guide for creating your own Arch Linux repository of compiled AUR packages which will be auto-updated by Github Actions and hosted on Github repository.

{% warning() %}
Words in the `<>` symbols are placeholders, replace them with your values
{% end %}

## Repo Setup

First of all, clone [binaur](https://github.com/mrtnvgr/binaur) repository:

```shell-session
$ gh clone https://github.com/mrtnvgr/binaur
$ cd binaur
```

Clear commit history:

```shell-session
$ rm -rf .git
$ git init
```

Alter files with your info:

```shell-session
$ sed -i "s/mrtnvgr/<github-username>/g" README.md
$ sed -i "s/binaur/<repository-name>/g" README.md
```

Specify your preferred AUR packages:

{% codeblock(name=".github/workflows/build.yml") %}
```yaml
packages: |
  <foo-bin>
  <bar>
  <baz-git>
```
{% end %}

Commit changes and upload your fork to the Github:

```shell-session
$ git add .
$ git commit -m "Initial commit"
$ gh repo create <repo> --public --source=. --push
```

Done! The workflow will update packages and make a release every day.

You can view the current status of the workflow using `gh workflow view build.yml` command. Wait until the first run completion and move on to the [Pacman Setup](#pacman-setup) section.

## Pacman Setup

Add your new repository to the `/etc/pacman.conf` file:

```toml
[<gh-repo-name>]
SigLevel = Optional
Server = https://github.com/<username>/<repo>/releases/download/$arch
```

Update pacman databases and install your packages:

```shell-session
$ pacman -Sy <foo-bin> <bar> <baz-git>
```
