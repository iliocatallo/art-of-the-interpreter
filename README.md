<div align="center">
  <img src="https://www.dropbox.com/scl/fi/lw11e00um1nqjyqvksprt/fez.png?rlkey=w6rmop902ly0285j9v7yvsod0&raw=1" width="120"/>
</div>
<br>
<div align="center">
	<img alt="eval/apply" src="https://img.shields.io/badge/eval%2Fapply-approved-yellow"/>
	<img alt="Coverage" src="https://img.shields.io/badge/code%20is%20data-data%20is%20code-yellow"/>
</div>
<div align="center">
	<h2>The Art of The Interpreter</h2>
	<p> An interactive exploration of Steele and Sussman's classic paper <br>“The Art of The Interpreter”
</div>

## Introduction

The paper approaches the problem of constructing modular systems from the eyes of a language designer. In order to conduct their
analysis, the authors introduce an initial interpreter for a restricted LISP dialect – which is then progressively extended in an
effort to better support modularity.

As part of the presentation, we will implement from the ground up the interpreter and its extensions. At each step, we will assess our current ability to construct modular systems by testing our running implementation against the examples in the paper.

## Running the presentation

To start the presentation on a Mac:

```
./patat art-of-the-interpreter.md
```

Please refer to the [Requirements](#requirements) section for more details.

## Requirements

The presentation should work on every system where the presentation tool [Patat](https://github.com/jaspervdj/patat) is available. A working installation of [Deno](https://deno.com/) is required to run the examples in the slides.

Note that an installation of [Rosetta 2](https://support.apple.com/en-us/HT211861) may be needed for Macs with M chips.

## License

This work is licensed under <a href="http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer">CC BY-NC 4.0</a>.

<hr/>
<sub>
<a href="https://www.flaticon.com/free-icons/fez" title="fez icons">Fez icons created by Smashicons - Flaticon</a>
</sub>