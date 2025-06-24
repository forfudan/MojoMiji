# Glossary

This glossary provides a list of key terms and concepts related to the Mojo programming language, along with the locations in the Miji where they are discussed.

| Term and concept                                                  | Comments                                                                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [variable](../basic/variables)                                    |                                                                                                                                                   |
| [identifier](../basic/variables#identifiers)                      | A symbolic name that refers to a value in the program.                                                                                            |
| [uninitialized variable](../basic/variables#create-variables)     | A variable that has been declared but not yet assigned a value.                                                                                   |
| [dunder method](../basic/variables#identifiers)                   | A method whose name starts and ends with double underscores, e.g., `__xxxx__()`, used for special operations in Mojo.                             |
| [shadowing](../basic/variables)                                   | To declare a new variable with the same name as an existing one, effectively overwriting the original variable.                                   |
| [R-value and L-value](../basic/types#literals-and-type-inference) | A value can be either an r-value or an l-value depending on their behaviors on the memory.                                                        |
| [constructor](../basic/types)                                     | A special method that initializes a new instance of a specific type.                                                                              |
| [offset](../basic/types#list-in-memory)                           | The distance between the start of a data structure and a specific field within it, measured in the byte size of the data type (not the raw byte). |
| [type checker](../basic/control#non-exhaustive-conditionals)      | A tool in Python that statically checks the types of variables and expressions, and will warn you if there are type mismatches.                   |
| [reference](../advanced/references)                               | An alias (body double) of a variable that allows access to the original variable without copying it.                                              |
| [safe pointer](../advanced/references)                            | A type that holds the address of a value in memory and the lifetime information of the owner. It is guaranteed to be safe to dereference.         |
| [Unsafe pointer](../advanced/references)                          | A type that holds an address in memory. You can de-reference it to access the value at that address.                                              |
| [overloading](../basic/functions#function-overloading)            | To declare multiple functions with the same name but different arguments.                                                                         |
| [uninitialized](../basic/variables#variable-declaration)          | A variable that has been declared but not yet assigned a value.                                                                                   |
| [compile time](../advanced/ownership)                             | The period when the Mojo code is translated into machine code.                                                                                    |
| [run time](../advanced/ownership)                                 | The period when the compiled code is executed.                                                                                                    |
| [dereferencing operator](../advanced/ownership)                   | An operator that accesses the value of a pointer. It is `[]` in Mojo.                                                                             |
