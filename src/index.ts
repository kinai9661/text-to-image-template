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
                <option value="@cf/black-forest-labs/flux-1-schnell">FLUX.1 Schnell <span class="badge-fast">⚡ 快速</span></option>
                <option value="@cf/stabilityai/stable-diffusion-xl-base-1.0" selected>Stable Diffusion XL 1.0 <span class="badge-quality">🎯 平衡</span></option>
                <option value="@cf/bytedance/stable-diffusion-xl-lightning">SDXL Lightning <span class="badge-fast">⚡ 超快</span></option>
                <option value="@cf/lykon/dreamshaper-8-lcm">DreamShaper 8 LCM <span class="badge-quality">🎨 艺术</span></option>
                <option value="@cf/runwayml/stable-diffusion-v1-5-inpainting">SD 1.5 Inpainting <span class="badge-quality">✏️ 修复</span></option>
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
            '@cf/black-forest-labs/flux-1-schnell': {
                name: 'FLUX.1 Schnell',
                desc: '最新 FLUX 模型，生成速度极快（2-4秒），图像质量出色，适合需要快速迭代的场景。',
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

        // Update model info when selection changes
        modelSelect.addEventListener('change', () => {
            const selectedModel = modelSelect.value;
            const info = modelDescriptions[selectedModel];
            modelInfo.innerHTML = `<strong>${info.name}:</strong> ${info.desc}`;
        });

        // Example tags click handler
        document.querySelectorAll('.example-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                promptInput.value = tag.textContent;
            });
        });

        // Clear button
        clearBtn.addEventListener('click', () => {
            promptInput.value = '';
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

                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt, model })
                });

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
