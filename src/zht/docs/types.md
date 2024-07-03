# 類型

Python 是動態強類型語言, Python 的類型標註 (type hint) 只是爲了方便 IDE 進行靜態檢查, 利於閱讀, 而不是強制的, 對性能没有任何影响^[Cython, mypyc 等使漸進類型的編譯器可能會使用類型標註進行部分優化.].

相比之下, Mojo 是靜態編譯的. 因此, 每個變量都必須在初始化前聲明其值類型, 以便在内存中分配合適的空間. 在 Mojo 中, 類型標註則是必須的^[有時,編譯器可以根據等號右值的類型對等號左值的類型進行推斷. 在 Rust 中, IDE 甚至會直接將推斷後的類型顯示在代碼中, 供用户檢查. Mojo 尚無此功能. 爲防止歧異, 還是推薦用户無論何時都進行類型標註.].

```mojo
fn main():
    var a: Float64 = 120.0
    var b: Int = 24
    var c: String = "Hello, world!"
    print(a, b, c)
```

```console
120.0 24 Hello, world!
```
