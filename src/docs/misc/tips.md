# Information, tips, and warnings

This chapter summarizes the information, tips, and warnings that are scattered throughout the Miji. It is intended to help you quickly find the information you need without having to search through the entire Miji.

[Syntax shapes your behavior - Rust vs Mojo in transfer of ownership](../advanced/ownership.md): Are you aware that your coding style is influenced by the syntax of the programming language you use?

[Arguments and reference - Mojo vs Rust](../basic/functions.md): Do you know that the term "reference" means different things in Mojo and Rust?

[danger ASAP Destruction Policy](../advanced/ownership.md): Do you know that Mojo compiler has a policy that destroys a variable as soon as they are used for the last time? However, any safe pointers to the variable can extend the lifetime of the variable to as long as the pointer is alive.
