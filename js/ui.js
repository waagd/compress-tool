document.addEventListener('DOMContentLoaded', () => {
    // 初始化压缩器和 DOM 元素
    const compressor = new FileCompressor();
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // 处理文件拖放
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover'); // 添加拖放效果
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover'); // 移除拖放效果
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files); // 处理拖放的文件
    });

    // 处理点击上传
    uploadArea.addEventListener('click', () => {
        fileInput.click(); // 触发文件选择框
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 处理压缩质量滑块
    qualitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        qualityValue.textContent = `${value}%`;
        compressor.setQuality(value);
    });

    // 文件处理主函数
    async function handleFiles(files) {
        for (const file of files) {
            try {
                showLoading(true); // 显示加载状态
                const fileType = FileCompressor.getFileType(file);
                
                // 根据文件类型选择不同的压缩方法
                if (fileType === 'image') {
                    const result = await compressor.compressImage(file);
                    updatePreview(file, result, 'image');
                } else if (fileType === 'video') {
                    const result = await compressor.compressVideo(file);
                    updatePreview(file, result, 'video');
                } else {
                    showError('不支持的文件格式');
                }
            } catch (error) {
                showError('压缩失败: ' + error.message);
            } finally {
                showLoading(false); // 隐藏加载状态
            }
        }
    }

    // 更新预览区域
    function updatePreview(originalFile, compressedResult, type) {
        const originalPreview = document.getElementById('originalPreview');
        const compressedPreview = document.getElementById('compressedPreview');
        const originalSize = document.getElementById('originalSize');
        const compressedSize = document.getElementById('compressedSize');

        // 清空预览区域
        originalPreview.innerHTML = '';
        compressedPreview.innerHTML = '';

        if (type === 'image') {
            // 显示图片预览
            const originalImg = new Image();
            originalImg.src = URL.createObjectURL(originalFile);
            originalImg.style.maxWidth = '100%';
            originalPreview.appendChild(originalImg);

            const compressedImg = new Image();
            compressedImg.src = compressedResult.preview;
            compressedImg.style.maxWidth = '100%';
            compressedPreview.appendChild(compressedImg);
        } else if (type === 'video') {
            // 显示视频预览
            const originalVideo = document.createElement('video');
            originalVideo.src = URL.createObjectURL(originalFile);
            originalVideo.controls = true;
            originalVideo.style.maxWidth = '100%';
            originalPreview.appendChild(originalVideo);

            const compressedVideo = document.createElement('video');
            compressedVideo.src = compressedResult.preview;
            compressedVideo.controls = true;
            compressedVideo.style.maxWidth = '100%';
            compressedPreview.appendChild(compressedVideo);
        }

        // 更新文件大小显示
        originalSize.textContent = FileCompressor.getFileSizeDescription(originalFile.size);
        compressedSize.textContent = FileCompressor.getFileSizeDescription(compressedResult.file.size);

        // 配置下载按钮
        downloadBtn.disabled = false;
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = compressedResult.preview;
            link.download = `compressed_${originalFile.name}`;
            link.click();
        };
    }

    // 显示/隐藏加载状态
    function showLoading(show) {
        const loadingEl = document.querySelector('.loading');
        if (show) {
            if (!loadingEl) {
                const loading = document.createElement('div');
                loading.className = 'loading';
                loading.innerHTML = '<div class="spinner"></div><p>正在压缩...</p>';
                document.body.appendChild(loading);
            }
        } else {
            loadingEl?.remove();
        }
    }

    // 显���错误消息
    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        document.body.appendChild(errorEl);
        setTimeout(() => errorEl.remove(), 3000); // 3秒后自动消失
    }
}); 