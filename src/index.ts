const HTML_PAGE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 文生图 - Text to Image</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 900px;
            width: 100%;
            padding: 40px;
        }

        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5em;
        }

        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }

        .input-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            color: #555;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 1.1em;
        }

        textarea {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1em;
            font-family: inherit;
            resize: vertical;
            min-height: 100px;
            transition: border-color 0.3s;
        }

        textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        select {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1em;
            font-family: inherit;
            background: white;
            cursor: pointer;
            transition: border-color 0.3s;
        }

        select:focus {
            outline: none;
            border-color: #667eea;
        }

        .model-info {
            margin-top: 8px;
            padding: 10px;
            background: #f0f4ff;
            border-left: 3px solid #667eea;
            border-radius: 5px;
            font-size: 0.9em;
            color: #555;
        }

        .advanced-options {
            margin-top: 20px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 10px;
            border: 2px dashed #e0e0e0;
        }

        .advanced-options h3 {
            color: #555;
            margin-bottom: 15px;
            font-size: 1em;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
        }

        .advanced-content {
            display: none;
        }

        .advanced-content.show {
            display: block;
        }

        .toggle-icon {
            transition: transform 0.3s;
        }

        .toggle-icon.rotated {
            transform: rotate(90deg);
        }

        .file-upload {
            margin-top: 10px;
        }

        .file-input-wrapper {
            position: relative;
            display: inline-block;
            width: 100%;
        }

        .file-input-wrapper input[type="file"] {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }

        .file-input-label {
            display: block;
            padding: 12px;
            background: white;
            border: 2px dashed #667eea;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .file-input-label:hover {
            background: #f0f4ff;
            border-color: #764ba2;
        }

        .preview-images {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .preview-item {
            position: relative;
            width: 100px;
            height: 100px;
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid #e0e0e0;
        }

        .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .preview-item .remove-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .button-group {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        button {
            flex: 1;
            padding: 15px 30px;
            font-size: 1.1em;
            font-weight: 600;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .generate-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .generate-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .clear-btn {
            background: #f5f5f5;
            color: #666;
        }

        .clear-btn:hover {
            background: #e0e0e0;
        }

        .result-container {
            display: none;
            margin-top: 30px;
        }

        .result-container.show {
            display: block;
        }

        .image-wrapper {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        #resultImage {
            width: 100%;
            height: auto;
            display: block;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #667eea;
            font-size: 1.2em;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error {
            background: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
        }

        .examples {
            margin-top: 20px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 10px;
        }

        .examples h3 {
            color: #555;
            margin-bottom: 10px;
            font-size: 1em;
        }

        .example-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .example-tag {
            background: white;
            color: #667eea;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            cursor: pointer;
            border: 1px solid #667eea;
            transition: all 0.3s;
        }

        .example-tag:hover {
            background: #667eea;
            color: white;
        }

        .model-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.75em;
            font-weight: 600;
            margin-left: 8px;
        }

        .badge-premium {
            background: #ffd700;
            color: #333;
        }

        .badge-fast {
            background: #4caf50;
            color: white;
        }

        .badge-quality {
            background: #2196f3;
            color: white;
        }

        .badge-new {
            background: #ff6b6b;
            color: white;
        }

        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }

            h1 {
                font-size: 1.8em;
            }

            .button-group {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 AI 文生图</h1>
        <p class="subtitle">使用多种 AI 模型将您的文字描述转换为精美图像</p>

        <div class="input-group">
            <label for="model">选择 AI 模型</label>
            <select id="model">
                <option value="@cf/black-forest-labs/flux-2-dev">🆕 FLUX.2 [dev] - 最新顶级模型</option>
                <option value="@cf/black-forest-labs/flux-1-schnell">FLUX.1 Schnell - 快速</option>
                <option value="@cf/stabilityai/stable-diffusion-xl-base-1.0" selected>Stable Diffusion XL 1.0 - 平衡</option>
                <option value="@cf/bytedance/stable-diffusion-xl-lightning">SDXL Lightning - 超快</option>
                <option value="@cf/lykon/dreamshaper-8-lcm">DreamShaper 8 LCM - 艺术</option>
                <option value="@cf/runwayml/stable-diffusion-v1-5-inpainting">SD 1.5 Inpainting - 修复</option>
            </select>
            <div class="model-info" id="modelInfo">
                <strong>Stable Diffusion XL 1.0:</strong> 平衡质量与速度，适合大多数场景，生成高质量的真实感或艺术风格图像。
            </div>
        </div>

        <div class="input-group">
            <label for="prompt">输入提示词 (Prompt)</label>
            <textarea 
                id="prompt" 
                placeholder="例如: a beautiful sunset over mountains, highly detailed, 4k"
            >cyberpunk cat</textarea>
        </div>

        <div class="advanced-options" id="flux2Options" style="display: none;">
            <h3 onclick="toggleAdvanced()">
                <span class="toggle-icon" id="toggleIcon">▶</span>
                🔧 FLUX.2 高级功能 (可选)
            </h3>
            <div class="advanced-content" id="advancedContent">
                <div class="file-upload">
                    <label>🖼️ 上传参考图片 (最多 4 张, 512x512)</label>
                    <div class="file-input-wrapper">
                        <input type="file" id="referenceImages" accept="image/*" multiple>
                        <label class="file-input-label" for="referenceImages">
                            📁 点击选择图片或拖拽到此处
                        </label>
                    </div>
                    <div class="preview-images" id="previewImages"></div>
                    <p style="margin-top: 8px; font-size: 0.85em; color: #888;">
                        提示: 可以在 prompt 中引用图片，例如 "take the subject of image 1 and style it like image 0"
                    </p>
                </div>
            </div>
        </div>

        <div class="examples">
            <h3>💡 示例提示词 (点击使用):</h3>
            <div class="example-tags">
                <span class="example-tag">cyberpunk cat</span>
                <span class="example-tag">a beautiful landscape with mountains and lake, sunset</span>
                <span class="example-tag">futuristic city at night, neon lights, cinematic</span>
                <span class="example-tag">cute robot playing with flowers in a garden</span>
                <span class="example-tag">abstract art, colorful, vibrant, modern style</span>
                <span class="example-tag">anime girl with blue hair, detailed face</span>
                <span class="example-tag">realistic portrait of a samurai warrior</span>
                <span class="example-tag">fantasy dragon flying over castle</span>
            </div>
        </div>

        <div class="button-group">
            <button class="generate-btn" id="generateBtn">🚀 生成图像</button>
            <button class="clear-btn" id="clearBtn">🗑️ 清空</button>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="spinner"></div>
            <p>正在生成图像，请稍候...</p>
            <p style="font-size: 0.9em; color: #999; margin-top: 10px;">
                FLUX.2 模型可能需要较长时间，请耐心等待
            </p>
        </div>

        <div id="error" class="error" style="display: none;"></div>

        <div id="resultContainer" class="result-container">
            <h3 style="margin-bottom: 15px; color: #333;">✨ 生成结果:</h3>
            <div class="image-wrapper">
                <img id="resultImage" alt="Generated Image">
            </div>
        </div>
    </div>

    <script>
        const modelDescriptions = {
            '@cf/black-forest-labs/flux-2-dev': {
                name: 'FLUX.2 [dev]',
                desc: '最新顶级模型！支持多图片输入、JSON 提示、多语言支持、高保真度图像生成。适合数字资产创作、风格迁移、角色合成。',
                badge: 'new',
                supportsMultiImage: true
            },
            '@cf/black-forest-labs/flux-1-schnell': {
                name: 'FLUX.1 Schnell',
                desc: 'FLUX 模型，生成速度极快（2-4秒），图像质量出色，适合需要快速迭代的场景。',
                badge: 'fast'
            },
            '@cf/stabilityai/stable-diffusion-xl-base-1.0': {
                name: 'Stable Diffusion XL 1.0',
                desc: '平衡质量与速度，适合大多数场景，生成高质量的真实感或艺术风格图像。',
                badge: 'quality'
            },
            '@cf/bytedance/stable-diffusion-xl-lightning': {
                name: 'SDXL Lightning',
                desc: '字节跳动优化版本，生成速度快，适合批量生成和快速原型设计。',
                badge: 'fast'
            },
            '@cf/lykon/dreamshaper-8-lcm': {
                name: 'DreamShaper 8 LCM',
                desc: '艺术风格模型，擅长生成梦幻、插画风格的图像，色彩鲜艳丰富。',
                badge: 'quality'
            },
            '@cf/runwayml/stable-diffusion-v1-5-inpainting': {
                name: 'SD 1.5 Inpainting',
                desc: '图像修复模型，可用于编辑和修复图像的特定区域。',
                badge: 'quality'
            }
        };

        const promptInput = document.getElementById('prompt');
        const modelSelect = document.getElementById('model');
        const modelInfo = document.getElementById('modelInfo');
        const generateBtn = document.getElementById('generateBtn');
        const clearBtn = document.getElementById('clearBtn');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const resultContainer = document.getElementById('resultContainer');
        const resultImage = document.getElementById('resultImage');
        const flux2Options = document.getElementById('flux2Options');
        const referenceImagesInput = document.getElementById('referenceImages');
        const previewImagesContainer = document.getElementById('previewImages');
        
        let uploadedImages = [];

        function toggleAdvanced() {
            const content = document.getElementById('advancedContent');
            const icon = document.getElementById('toggleIcon');
            content.classList.toggle('show');
            icon.classList.toggle('rotated');
        }

        // Update model info when selection changes
        modelSelect.addEventListener('change', () => {
            const selectedModel = modelSelect.value;
            const info = modelDescriptions[selectedModel];
            modelInfo.innerHTML = `<strong>${info.name}:</strong> ${info.desc}`;
            
            // Show/hide FLUX.2 options
            if (info.supportsMultiImage) {
                flux2Options.style.display = 'block';
            } else {
                flux2Options.style.display = 'none';
                uploadedImages = [];
                previewImagesContainer.innerHTML = '';
            }
        });

        // Handle image uploads
        referenceImagesInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files).slice(0, 4); // Max 4 images
            
            for (const file of files) {
                if (uploadedImages.length >= 4) break;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedImages.push({
                        file: file,
                        dataUrl: event.target.result
                    });
                    renderPreviews();
                };
                reader.readAsDataURL(file);
            }
            
            // Reset input
            referenceImagesInput.value = '';
        });

        function renderPreviews() {
            previewImagesContainer.innerHTML = '';
            uploadedImages.forEach((img, index) => {
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `
                    <img src="${img.dataUrl}" alt="Reference ${index}">
                    <button class="remove-btn" onclick="removeImage(${index})">×</button>
                `;
                previewImagesContainer.appendChild(div);
            });
        }

        window.removeImage = function(index) {
            uploadedImages.splice(index, 1);
            renderPreviews();
        };

        // Example tags click handler
        document.querySelectorAll('.example-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                promptInput.value = tag.textContent;
            });
        });

        // Clear button
        clearBtn.addEventListener('click', () => {
            promptInput.value = '';
            uploadedImages = [];
            previewImagesContainer.innerHTML = '';
            resultContainer.classList.remove('show');
            error.style.display = 'none';
        });

        // Generate button
        generateBtn.addEventListener('click', async () => {
            const prompt = promptInput.value.trim();
            const model = modelSelect.value;
            
            if (!prompt) {
                showError('请输入提示词！');
                return;
            }

            try {
                generateBtn.disabled = true;
                loading.style.display = 'block';
                error.style.display = 'none';
                resultContainer.classList.remove('show');

                // Check if using FLUX.2 with images
                const isFlux2 = model === '@cf/black-forest-labs/flux-2-dev';
                const hasImages = uploadedImages.length > 0;

                let response;
                
                if (isFlux2 && hasImages) {
                    // Use FormData for FLUX.2 with images
                    const formData = new FormData();
                    formData.append('prompt', prompt);
                    
                    // Add images with proper naming
                    for (let i = 0; i < uploadedImages.length; i++) {
                        formData.append(`input_image_${i}`, uploadedImages[i].file);
                    }
                    
                    response = await fetch('/generate', {
                        method: 'POST',
                        body: formData
                    });
                } else {
                    // Use JSON for other models or FLUX.2 without images
                    response = await fetch('/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ prompt, model })
                    });
                }

                if (!response.ok) {
                    throw new Error('生成失败，请重试');
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                
                resultImage.src = imageUrl;
                resultContainer.classList.add('show');
                loading.style.display = 'none';

            } catch (err) {
                showError(err.message || '生成失败，请稍后重试');
                loading.style.display = 'none';
            } finally {
                generateBtn.disabled = false;
            }
        });

        function showError(message) {
            error.textContent = message;
            error.style.display = 'block';
        }

        // Enter key to generate
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateBtn.click();
            }
        });
    </script>
</body>
</html>
`;

interface Env {
	AI: any;
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);

		// Serve UI on GET /
		if (request.method === 'GET' && url.pathname === '/') {
			return new Response(HTML_PAGE, {
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			});
		}

		// Handle image generation on POST /generate
		if (request.method === 'POST' && url.pathname === '/generate') {
			try {
				const contentType = request.headers.get('content-type') || '';
				
				// Check if it's multipart/form-data (for FLUX.2 with images)
				if (contentType.includes('multipart/form-data')) {
					const formData = await request.formData();
					const prompt = formData.get('prompt') as string;
					
					if (!prompt?.trim()) {
						return new Response(JSON.stringify({ error: 'Prompt is required' }), {
							status: 400,
							headers: { 'content-type': 'application/json' },
						});
					}

					// Collect reference images
					const images: File[] = [];
					for (let i = 0; i < 4; i++) {
						const img = formData.get(`input_image_${i}`);
						if (img && img instanceof File) {
							images.push(img);
						}
					}

					// Create new FormData for AI request
					const aiFormData = new FormData();
					aiFormData.append('prompt', prompt);
					
					// Add images to AI request
					for (let i = 0; i < images.length; i++) {
						const arrayBuffer = await images[i].arrayBuffer();
						const blob = new Blob([arrayBuffer]);
						aiFormData.append(`input_image_${i}`, blob);
					}

					// Call FLUX.2 model
					const response = await env.AI.run(
						'@cf/black-forest-labs/flux-2-dev',
						aiFormData
					);

					return new Response(response, {
						headers: {
							'content-type': 'image/png',
							'cache-control': 'public, max-age=3600',
						},
					});
				} else {
					// JSON request for other models
					const body = await request.json() as { prompt: string; model?: string };
					const prompt = body.prompt?.trim();
					const model = body.model || '@cf/stabilityai/stable-diffusion-xl-base-1.0';

					if (!prompt) {
						return new Response(JSON.stringify({ error: 'Prompt is required' }), {
							status: 400,
							headers: { 'content-type': 'application/json' },
						});
					}

					// Validate model
					const allowedModels = [
						'@cf/black-forest-labs/flux-2-dev',
						'@cf/black-forest-labs/flux-1-schnell',
						'@cf/stabilityai/stable-diffusion-xl-base-1.0',
						'@cf/bytedance/stable-diffusion-xl-lightning',
						'@cf/lykon/dreamshaper-8-lcm',
						'@cf/runwayml/stable-diffusion-v1-5-inpainting'
					];

					if (!allowedModels.includes(model)) {
						return new Response(JSON.stringify({ error: 'Invalid model' }), {
							status: 400,
							headers: { 'content-type': 'application/json' },
						});
					}

					// For FLUX.2 without images, still need to use FormData
					if (model === '@cf/black-forest-labs/flux-2-dev') {
						const formData = new FormData();
						formData.append('prompt', prompt);
						
						const response = await env.AI.run(model, formData);
						
						return new Response(response, {
							headers: {
								'content-type': 'image/png',
								'cache-control': 'public, max-age=3600',
							},
						});
					} else {
						// Other models use JSON input
						const inputs = {
							prompt: prompt,
						};

						const response = await env.AI.run(model, inputs);

						return new Response(response, {
							headers: {
								'content-type': 'image/png',
								'cache-control': 'public, max-age=3600',
							},
						});
					}
				}
			} catch (error) {
				console.error('Image generation error:', error);
				return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
					status: 500,
					headers: { 'content-type': 'application/json' },
				});
			}
		}

		// 404 for other routes
		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
