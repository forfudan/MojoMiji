# NDArray type

## Array initializing

Array initializing method, i.e., `__init__` constructs a pure container
by reading in the shape and the stride information.
Although the memory is allocated, it is not initialized.
Users should always construct arrays using functions in creation routines.
For example, `zeros`, `ones`, `randn`, `array`, etc.

The following ways of array initializing are supported:

1. `NDArrayShape` and `order`.
2. `List` and `order`.
3. `VariadicList` and `order`.

## Array indexing and slicing

### Array indexing

Array indexing always returns a scalar or an SIMD.

"safe" means whether boundary checks are made.
"order" means whether it evaluate the order or directly gets value from the underlying buffer.
If yes, the strides information will be considered.
If no, the indexing will based on the continuous allocation of the data buffer.

| method (overload) | args | Ret    | safe? | order? | notes           |
| ----------------- | ---- | ------ | ----- | ------ | --------------- |
| `_getitem`        | *Int | Scalar | no    | yes    |                 |
| `__getitem__`     | Idx  | Scalar | yes   | yes    |                 |
| `item`            | Int  | Scalar | yes   | yes    | `[0, size)`     |
| `item`            | *Int | Scalar | yes   | yes    | `[0, shape[i])` |
| `load`            | Int  | Scalar | yes   | no     |                 |
| `load[width]`     | Int  | SIMD   | yes   | no     |                 |
| `load[width]`     | *Int | SIMD   | yes   | no     |                 |

### Array slicing

Array slicing always returns an NDArray of the same number of dimensions or less.
Currently, the returns are copies of the data.
In future, when Mojo's trait are enhanced, slicing will returns a view of the data of the array.

| method (overload) | args                 | safe? | order? | notes                |
| ----------------- | -------------------- | ----- | ------ | -------------------- |
| `__getitem__`     | Int                  | yes   | yes    | i-th row of input    |
| `__getitem__`     | List[Int]            | yes   | yes    | Rows of input        |
| `__getitem__`     | List[Slice]          | yes   | yes    | Same ndim as input   |
| `__getitem__`     | *args[Slice]         | yes   | yes    | Same ndim as input   |
| `__getitem__`     | *Slice               | yes   | yes    | Same ndim as input   |
| `__getitem__`     | *Variant[Slice, Int] | yes   | yes    | Same or smaller ndim |
| `__getitem__`     | NDArray[DType.bool]  | no    | no     | Items of buffer      |
| `__getitem__`     | NDArray[DType.index] | no    | no     | Items of buffer      |