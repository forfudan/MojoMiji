# NuMojo 矩陣和數值運算庫

[NuMojo](https://github.com/Mojo-Numerics-and-Algorithms-group/NuMojo) 是使用純 Mojo 語言編寫的向量和数值計算庫，類似 numpy[https://numpy.org/]，提供矩陣運算、数值運算等功能。

目前，Numojo 發佈了 v0.1 版本，包括多維矩陣和其方法。

我有幸作爲 v0.1 的三名貢獻者之一，這一系列文檔中，我會對 Numojo 的使用方法進行介紹。

```mojo
import numojo as nm

fn main() raises:
    # Generate two 1000x1000 matrices with random float64 values
    var A = nm.NDArray[nm.f64](shape=List[Int](1000,1000), random=True)
    var B = nm.NDArray[nm.f64](1000,1000, random=True)

    # Print AB
    print(nm.linalg.matmul_parallelized(A, B))
```
