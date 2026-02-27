# NDArray View

## Introduction

Array view is a special kind of array who does not own the underlying data but use a reference to the data owned by other arrays.

The array view is particularly helpful if you want to obtain the sliced array without copying the underlying data. The time consumed in creating slices is constant.

(Note: This feature is not yet implement but a proposal.)

## Data structure

Recall that `NDArray` is defined as

```mojo
struct NDArray[dtype: DType = DType.float64, Buffer: Bufferable = OwnedData](Stringable, Writable):
```

The array view is actually:

```mojo
NDArray[dtype, Buffer = RefData[origin_of(existing_array)]
```

The underlying data buffer of `NDArray` is `OwnedData`, which is a wrapper of owned `UnsafePointer`. The underlying data buffer of view of data is `RefData`, which is a wrapper of referenced `UnsafePointer` of another array.

Both `OwnedData` and `RefData` are of the `Bufferable` trait. You can always obtain the pointer to the underying buffer of array `a`, no matter it is a view or not, by:

```mojo
a._buf.get_ptr()  # UnsafePointer
```

## Constructing view

Constructing a view is simple: Passing a reference to the underlying data buffer, and specify the shape and strides information of the view. No copying of data happens in this process.

```mojo
fn __init__(
    out self,
    shape: NDArrayShape,
    strides: NDArrayStrides,
    ptr: UnsafePointer[Scalar[dtype],
    offset: Int,
):
    self.shape = shape
    self.strides = strides
    self.size = self.shape.size
    self._buf = Buffer(ptr=ptr+offset)
```

See, the array view will simply re-use the data buffer of an existing array (mutable reference), but with some offset in pointer, new shape, and new strides information.

## Offset, shape, and strides of view

The shape and strides of the view can be determined based on:

- The shape and strides of the original array.
- The start, end, and step of the slices.

Here is an example, an 6x8 array with 48 items. The values in the box can be seen as both the addresses of vitual memory and the values stored there.

```console
a 
┌──┬──┬──┬──┬──┬──┬──┬──┐
│ 0│ 1│ 2│ 3│ 4│ 5│ 6│ 7│
├──┼──┼──┼──┼──┼──┼──┼──┤
│ 8│ 9│10│11│12│13│14│15│
├──┼──┼──┼──┼──┼──┼──┼──┤
│16│17│18│19│20│21│22│23│
├──┼──┼──┼──┼──┼──┼──┼──┤
│24│25│26│27│28│29│30│31│
├──┼──┼──┼──┼──┼──┼──┼──┤
│32│33│34│35│36│37│38│39│
├──┼──┼──┼──┼──┼──┼──┼──┤
│40│41│42│43│44│45│46│47│
└──┴──┴──┴──┴──┴──┴──┴──┘
```

This array `a` has `shape=(6,8)` and `strides=(8,1)`.

Now we want to obtain a slice of the array `a` as a view. Let's say `b = a[1:6:2, 2:8:2]`. By taking out all the values needed, the array view `b` should look like as follows.

```console
b = a[1:6:2, 2:8:2]
┌──┬──┬──┐
│10│12│14│
├──┼──┼──┤
│26│28│30│
├──┼──┼──┤
│42│44│46│
└──┴──┴──┘
```

This array view `b` has `offset=10`, `shape=(3,3)` and `strides=(16,2)`.

A set of more general formulae to get information of array view goes as follows.

$$
\begin{aligned}
offset_b &= \overrightarrow{start} \cdot \overrightarrow{strides_a}\\
shape_b &= \lceil \frac{\overrightarrow{end} - \overrightarrow{start}}{\overrightarrow{step}} \rceil \text{(item-wise)}\\
stride_b &= \overrightarrow{step} \cdot \overrightarrow{strides_a}
\end{aligned}
$$

Here are shape and strides for other operations:

- `transpose`: Just swap the corresponding items of shape and strides.
- `flip`: It is equivalent to slice `[len-1: -1: -1]`.

## View indexing

Recall that the buffer location of a value can be calculated by the following formula:

$$
\text{Buffer address} = offset + \overrightarrow{index} \cdot \overrightarrow{strides}
$$

So, item `(1, 1)` of array view `b` has the adress `10 + 1*16 + 1*2 = 28`. item `(2, 0)` of array view `b` has the adress `10 + 2*16 + 0*2 = 42`. This is exactly as displayed in the figure above.

## Slice of whole axis

Sometimes we want to retrieve a whole axis of an array (row of matrix, plain of ndarray, etc). For example, `a[1]` or `a[1, :]` returns the second row of the matrix `a` above, which would be:

```console
a[1]:
┌──┬──┬──┬──┬──┬──┬──┬──┐
│ 8│ 9│10│11│12│13│14│15│
└──┴──┴──┴──┴──┴──┴──┴──┘
```

In this sense, the original strides information will not be useful (no matter the ndim decreases by 1 or not) because you never travel to the next row.

In `numpy`, the strides can be arbitary when the `shape[i] == 1`, which means that F-continous being true does not necessarily mean that `strides[0] == itemsize`, and that C-continous being true does not necessarily mean that `strides[-1] == itemsize`.

```python
>>> a = np.arange(9).reshape((3,3))
>>> b = a[::100, :]
>>> print(a.flags)
(24, 8)
>>> print(b.flags)
C_CONTIGUOUS : True
F_CONTIGUOUS : True
OWNDATA : False
WRITEABLE : True
ALIGNED : True
WRITEBACKIFCOPY : False
>>> print(b.strides)
(2400, 8)
```

**In Numojo, the slices shall be first normalized so that the flag will reflect the true memory layout.**

## Decrease of ndim

Sometimes, slice results in decrease of dimensions, e.g., `a[1]`. The new shape and the new strides can be determined by dropping the corresponding axis. The offset can be calcuated using:

$$
offset_b = \overrightarrow{start} \cdot \overrightarrow{strides_a}
$$

For instance, `a` has shape `(6, 8)` and strides `(8, 1)`.

Then, `b = a[1]` has shape `(8)`, strides `(1)`, and offset `8`.
$$
offset_b = (1, 0) \cdot (8, 1) = 8
$$

```console
b = a[1]:
┌──┬──┬──┬──┬──┬──┬──┬──┐
│ 8│ 9│10│11│12│13│14│15│
└──┴──┴──┴──┴──┴──┴──┴──┘
```

## SIMD operations

To perform SIMD operations on view of array, we need to verify whether the items are still continously store in memory. This can be checked by:

- If `strides[-1] = 1`, then it is continous on the last axis (C-continuous).
- If `strides[0] = 1`, then it is continous on the first axis (F-continuous).
- For 1darray, it can both be C-continous and F-continuous.

If the checks pass, we can still load and store more than one items via SIMD. Otherwise, we should load the values individually with their indices.

(Notes: `order=="F"` should be replaced by `strides[0]==1` in future.)
