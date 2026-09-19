# PawStory 制造模型修改说明

## 采用的上游结构思路

本项目的回忆牌结构**基于开源模型改编**：参考 [scadqr](https://github.com/xypwn/scadqr) 的 `demo_tag.scad`，固定 commit `a27e1feeed8b048b730fcd2620c0021b3b52a283`。上游作者为 Darwin Schuppan and contributors，许可证为 MIT；原文保存在 `THIRD_PARTY_LICENSES/scadqr-MIT.txt`，也会随 ZIP 制作包分发。

采用的结构思路仅包括圆角底板、固定孔和 QR padding。项目没有直接分发上游 SCAD；Three.js/TypeScript 几何为重新实现。

## 项目修改

- 改为默认 60 × 42 × 3 mm 的圆角矩形底座，设置两个贯穿固定孔。
- 增加同宽高、同孔位的独立激光雕刻面板。
- 建立唯一 `TagParameters`，Three.js 预览与 STLExporter 共用同一底座 BufferGeometry。
- QR 固定为真实回忆 URL，使用 H 纠错和至少 4 modules 静区。
- ASCII A–Z/0–9 标签使用项目内 5×7 点阵轮廓，不使用 SVG `<text>`。
- 增加项目自建柔性链接参照网格；它只用于结构展示，不提供 STL 下载。

## 尚未验证

未验证打印机／材料公差、激光设备与材料组合、固定强度、防水性、宠物舒适度或服装合身性。项目不产生激光功率、速度或 G-code。所有制造参数与宠物穿戴安全必须通过实物打样确认。
