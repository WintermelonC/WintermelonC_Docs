# Anaconda

## 1 备份环境

1. 导出环境配置文件
      - `conda env export > environment.yml`
2. 还原环境
      - `conda env create -f environment.yml`

## 2 更新当前环境的 Python 版本

!!! info "参考"

    [Anaconda 中更新当前环境的 Python 版本](https://blog.csdn.net/weixin_46084533/article/details/137995215){:target="_blank"}

1. 激活目标环境
      - `conda activate {environment}`
2. 检查可用的 Python 更新版本
      - `conda search python`
3. 更新 Python 版本
      - 更新到指定版本：`conda install python=x.x.x`
      - 更新到最新版本：`conda update python`

