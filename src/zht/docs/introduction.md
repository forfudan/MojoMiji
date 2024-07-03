# 簡介

Mojo 是由 Modular 研發的新一代編程語言, 於 2023 年公開, 並於 2024 年對標準庫進行開源. Mojo 的研發初衷是爲了成爲 Python 語言的超集, 並引入靜態編譯、所有權、元編程等一系列特徵, 旨在保障安全性的基礎上增加運行速度, 方便 Python 用户遷移.

Mojo 在語法上借鉴了 Python 風格, 同加了類型標註的 Python 代碼極爲相近. Mojo 在使用上, 可以方便導入 Python 的函數和包. 以下分别爲 Python 和 Mojo 代碼. 可見, 兩者的風格極爲相似.

```python
a: str = "Hello, world!"
print(a)

b: int = 8
for i in range(10):
    b = b + i
print(b)
```

```mojo
var a: String = "Hello, world!"
print(a)

var b: Int = 8
for i in range(10):
    b = b + i
print(b)
```

Mojo 的長期目標是成爲 Python 的超集, 完全兼容 Python 語法^[筆者認爲這一點有難度, 比較合理的預期是用户只需要對 Python 代碼做少量改動即可在 Mojo 中編譯.].

本網站介紹 Mojo 的基本特徵、語法、功能, 方便使用者瞭解本語言. 由於 Mojo 自身定位就是基於 Python 的生態圈, 我在講解過程中將會以 Python 代碼對舉, 提示相似或不同之處, 説明 Mojo 設置某些特性的原因. 同時, 考慮到 Mojo 語言大量借鑑了 Rust 的特性, 我也會進行提示.

本攻略將會挑選重點主題陸續寫成. 注意到, Mojo 尚在開發初期, 語法變化極大, 很多關鍵字也有可能發生改變. Mojo 的編譯器是由 C++ 寫成, 目前尚未開源, 也未形成自舉(用 Mojo 編譯自身代碼). 官方也對此亦尚未計劃. 因此, 本攻略預計將在一個較長的時間段(五年左右)内不斷更新.

感謝大家的閱讀. 作者能力有限, 内容中可能有不少不精確之處, 還望大家不吝賜教.
