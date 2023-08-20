+++
title = "Strip your ELFs"
date = 2023-08-10
updated = 2023-08-18
+++

Not many people know that executables can be much smaller if they are "stripped". Stripping means removing debug information, relocations and other pretty much _useless_ for public release builds metadata.

## `strip` utility

If you have a binary file, you can strip it using the `strip` utility:

Example:

```sh
$ strip -s foo
```

### Tests

| Software | From [crates.io](https://crates.io) | Stripped |
| -------- | ----------------------------------- | -------- |
| selene   | 12MB                                | 7.5MB    |
| ripgrep  | 35MB                                | 4.7MB    |

## Rust

Cargo is capable of performing stripping as well as some other size optimizations for your project builds.

{% codeblock(name="Cargo.toml") %}
```toml
[profile.release]
strip = true
lto = true # Optimizations at the linker stage
codegen-units = 1 # **WARN**: disables parallel compilation
```
{% end %}

### Tests

| Mode                        | Size  | Compile time |
| :-------------------------- | ----- | ------------ |
| Default `--release` profile | 5.0MB | 14.33s       |
| Stripped                    | 944KB | 12.80s       |
| All optimizations           | 784KB | 20.42s       |

<br>

{% note() %}
"Enable strip in release mode by default" is proposed in [#4122](https://github.com/rust-lang/cargo/issues/4122).
{% end %}

## Cons

However, "stripping" is not the solution for everyone:

- Debugging becomes challenging (e.g. tiny backtraces)
- Profilers and performance analyzers may not work
- Stripped executables that rely on dynamic loading and linking may encounter issues.
