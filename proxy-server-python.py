#!/usr/bin/env python3
"""
🛡️ OpenAI API Proxy Server (Python Version)
Alternative solution nếu Node.js gặp vấn đề
Tạo bởi Claude Sonnet 4
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ===== CONFIGURATION =====
# Dual AI Provider Support: Google Gemini + OpenRouter AI
GEMINI_CONFIG = {
    'API_URL': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    'API_KEY': 'AIzaSyDAnBQKPWkJigLq_Hiy4PmqPvLkdW2AQAo',
    'MODEL': 'gemini-2.0-flash-exp',
    'MAX_TOKENS': 2000,
    'TEMPERATURE': 0.7
}

# OpenRouter AI Configuration (Access to GPT-4, Claude, Llama, etc.)
OPENROUTER_CONFIG = {
    'API_URL': 'https://openrouter.ai/api/v1/chat/completions',
    'API_KEY': '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',
    'MODEL': 'deepseek/deepseek-chat-v3.1:free',  # Default model - BEST Chat Model (5⭐)
    'MAX_TOKENS': 2000,
    'TEMPERATURE': 0.7,
    'MODELS': {
        # === 🏆 5-STAR MODELS (Must Keep - 8 models) ===
        'qwen3-coder-free': 'qwen/qwen3-coder:free',
        'deepseek-r1': 'deepseek/deepseek-r1:free',
        'llama-3.1-405b': 'meta-llama/llama-3.1-405b-instruct:free',
        'deepseek-chat-v3.1': 'deepseek/deepseek-chat-v3.1:free',
        'llama-3.3-70b': 'meta-llama/llama-3.3-70b-instruct:free',
        'llama-4-maverick': 'meta-llama/llama-4-maverick:free',
        'llama-4-scout': 'meta-llama/llama-4-scout:free',
        'grok-4-fast': 'x-ai/grok-4-fast:free',
        
        # === ⭐ 4-STAR MODELS (High Priority - 6 models) ===
        'qwen3-14b': 'qwen/qwen3-14b:free',
        'mistral-small-3.2': 'mistralai/mistral-small-3.2-24b-instruct:free',
        'devstral-small-2505': 'mistralai/devstral-small-2505:free',
        'gemini-2.0-flash-exp': 'google/gemini-2.0-flash-exp:free',
        'gemma-3-27b': 'google/gemma-3-27b-it:free',
        'qwq-32b': 'qwen/qwq-32b:free',
        
        # === 💫 3-STAR MODELS (Specific Use - 2 models) ===
        'llama-3.2-3b': 'meta-llama/llama-3.2-3b-instruct:free',
        'glm-4.5-air-free': 'z-ai/glm-4.5-air:free'
    }
}

# Groq AI Configuration (Super fast inference)
GROQ_CONFIG = {
    'API_URL': 'https://api.groq.com/openai/v1/chat/completions',
    'API_KEY': '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',
    'MODEL': 'llama-3.1-8b-instant',  # Default model - ultra fast
    'MAX_TOKENS': 2000,
    'TEMPERATURE': 0.7,
    'MODELS': {
        # 🚀 FREE Models Only (Cleaned up - matches script.js)
        'llama-3.1-8b-instant': 'llama-3.1-8b-instant',
        'llama-3.1-70b-versatile': 'llama-3.1-70b-versatile',
        'llama-3.2-1b-preview': 'llama-3.2-1b-preview',
        'llama-3.2-3b-preview': 'llama-3.2-3b-preview',
        'mixtral-8x7b-32768': 'mixtral-8x7b-32768',
        'gemma-7b-it': 'gemma-7b-it',
        'gemma2-9b-it': 'gemma2-9b-it',
        'whisper-large-v3': 'whisper-large-v3'
    }
}

# Default provider selection
DEFAULT_PROVIDER = 'openrouter'  # 'openrouter', 'gemini', or 'groq'

PORT = 3001

# ===== ROUTES =====

@app.route('/')
def serve_index():
    """Serve main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'AI Prompt Assistant Proxy Server (Python) is running',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/test-openai', methods=['GET'])  
def test_openai_legacy():
    """Legacy endpoint - redirects to Gemini for backward compatibility"""
    return test_ai_provider('gemini')

@app.route('/api/test-gemini', methods=['GET'])
def test_gemini():
    """Test Google Gemini API connection"""
    return test_ai_provider('gemini')

@app.route('/api/test-openrouter', methods=['GET'])
def test_openrouter():
    """Test OpenRouter AI API connection"""
    return test_ai_provider('openrouter')

@app.route('/api/test-groq', methods=['GET'])
def test_groq():
    """Test Groq AI API connection"""
    return test_ai_provider('groq')

@app.route('/api/test-all', methods=['GET'])
def test_all_providers():
    """Test all AI providers"""
    results = {
        'gemini': {},
        'openrouter': {},
        'groq': {}
    }
    
    # Test Gemini
    try:
        gemini_result = test_ai_provider('gemini')
        # Handle both tuple (response, status_code) and single response cases
        if isinstance(gemini_result, tuple):
            response_obj, status_code = gemini_result
            if hasattr(response_obj, 'get_json'):
                results['gemini'] = response_obj.get_json()
            else:
                results['gemini'] = {'success': False, 'error': f'Invalid response, status: {status_code}'}
        else:
            # Single response object
            if hasattr(gemini_result, 'get_json'):
                results['gemini'] = gemini_result.get_json()
            else:
                results['gemini'] = {'success': False, 'error': 'Invalid response format'}
    except Exception as e:
        results['gemini'] = {'success': False, 'error': str(e)}
    
    # Test OpenRouter
    try:
        openrouter_result = test_ai_provider('openrouter')
        # Handle both tuple (response, status_code) and single response cases
        if isinstance(openrouter_result, tuple):
            response_obj, status_code = openrouter_result
            if hasattr(response_obj, 'get_json'):
                results['openrouter'] = response_obj.get_json()
            else:
                results['openrouter'] = {'success': False, 'error': f'Invalid response, status: {status_code}'}
        else:
            # Single response object
            if hasattr(openrouter_result, 'get_json'):
                results['openrouter'] = openrouter_result.get_json()
            else:
                results['openrouter'] = {'success': False, 'error': 'Invalid response format'}
    except Exception as e:
        results['openrouter'] = {'success': False, 'error': str(e)}
    
    # Test Groq
    try:
        groq_result = test_ai_provider('groq')
        # Handle both tuple (response, status_code) and single response cases
        if isinstance(groq_result, tuple):
            response_obj, status_code = groq_result
            if hasattr(response_obj, 'get_json'):
                results['groq'] = response_obj.get_json()
            else:
                results['groq'] = {'success': False, 'error': f'Invalid response, status: {status_code}'}
        else:
            # Single response object
            if hasattr(groq_result, 'get_json'):
                results['groq'] = groq_result.get_json()
            else:
                results['groq'] = {'success': False, 'error': 'Invalid response format'}
    except Exception as e:
        results['groq'] = {'success': False, 'error': str(e)}
    
    return jsonify({
        'results': results,
        'summary': {
            'total_providers': 3,
            'working_providers': sum(1 for r in results.values() if r.get('success', False)),
            'timestamp': datetime.now().isoformat()
        }
    })

def test_ai_provider(provider='gemini'):
    """Test specified AI provider connection"""
    try:
        if provider == 'gemini':
            print('🔍 Testing Google Gemini API connection...')
            return test_gemini_api()
        elif provider == 'openrouter':
            print('🔍 Testing OpenRouter AI API connection...')
            return test_openrouter_api()
        elif provider == 'groq':
            print('🔍 Testing Groq AI API connection...')
            return test_groq_api()
        else:
            return jsonify({
                'success': False,
                'message': f'Unknown provider: {provider}',
                'error': 'Invalid provider specified'
            }), 400
            
    except Exception as e:
        print(f'❌ Server error testing {provider}: {str(e)}')
        return jsonify({
            'success': False,
            'message': f'Server error testing {provider} API connection',
            'error': str(e)
        }), 500

def test_gemini_api():
    """Test Google Gemini API specifically"""
    try:
        
        # Gemini API uses query parameter for API key
        url = f"{GEMINI_CONFIG['API_URL']}?key={GEMINI_CONFIG['API_KEY']}"
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        # Gemini API format - different from OpenAI
        payload = {
            'contents': [{
                'parts': [{
                    'text': 'Hello! This is a connection test.'
                }]
            }],
            'generationConfig': {
                'temperature': 0.1,
                'maxOutputTokens': 10
            }
        }
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print('✅ Google Gemini API connection successful')
            return jsonify({
                'success': True,
                'message': 'Google Gemini API connection successful',
                'status': response.status_code,
                'model': 'gemini-2.0-flash-exp',
                'provider': 'gemini'
            })
        else:
            print(f'❌ Gemini connection failed: {response.status_code}')
            error_data = {}
            try:
                error_data = response.json()
            except:
                error_data = {'error': 'Unknown error'}
                
            return jsonify({
                'success': False,
                'message': 'Google Gemini API connection failed',
                'error': error_data,
                'status': response.status_code
            }), response.status_code
            
    except Exception as e:
        print(f'❌ Server error testing Gemini: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error testing Gemini API connection',
            'error': str(e)
        }), 500

def test_openrouter_api():
    """Test OpenRouter AI API specifically"""
    try:
        url = OPENROUTER_CONFIG['API_URL']
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {OPENROUTER_CONFIG["API_KEY"]}',
            'HTTP-Referer': 'http://localhost:3001',
            'X-Title': 'AI Prompt Assistant'
        }
        
        # OpenRouter API format (OpenAI compatible)
        payload = {
            'model': OPENROUTER_CONFIG['MODEL'],
            'messages': [{
                'role': 'user',
                'content': 'Hello! This is a connection test.'
            }],
            'max_tokens': 10,
            'temperature': 0.1
        }
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            print('✅ OpenRouter AI API connection successful')
            response_data = response.json()
            return jsonify({
                'success': True,
                'message': 'OpenRouter AI API connection successful',
                'status': response.status_code,
                'model': OPENROUTER_CONFIG['MODEL'],
                'provider': 'openrouter',
                'usage': response_data.get('usage', {})
            })
        else:
            print(f'❌ OpenRouter connection failed: {response.status_code}')
            error_data = {}
            try:
                error_data = response.json()
            except:
                error_data = {'error': 'Unknown error'}
                
            return jsonify({
                'success': False,
                'message': 'OpenRouter AI API connection failed',
                'error': error_data,
                'status': response.status_code
            }), response.status_code
            
    except Exception as e:
        print(f'❌ Server error testing OpenRouter: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error testing OpenRouter API connection',
            'error': str(e)
        }), 500

def test_groq_api():
    """Test Groq AI API specifically"""
    try:
        url = GROQ_CONFIG['API_URL']
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GROQ_CONFIG["API_KEY"]}'
        }
        
        # Groq API format (OpenAI compatible)
        payload = {
            'model': GROQ_CONFIG['MODEL'],
            'messages': [{
                'role': 'user',
                'content': 'Hello! This is a connection test.'
            }],
            'max_tokens': 10,
            'temperature': 0.1
        }
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            print('✅ Groq AI API connection successful')
            response_data = response.json()
            return jsonify({
                'success': True,
                'message': 'Groq AI API connection successful',
                'status': response.status_code,
                'model': GROQ_CONFIG['MODEL'],
                'provider': 'groq',
                'usage': response_data.get('usage', {})
            })
        else:
            print(f'❌ Groq connection failed: {response.status_code}')
            error_data = {}
            try:
                error_data = response.json()
            except:
                error_data = {'error': 'Unknown error'}
                
            return jsonify({
                'success': False,
                'message': 'Groq AI API connection failed',
                'error': error_data,
                'status': response.status_code
            }), response.status_code
            
    except Exception as e:
        print(f'❌ Server error testing Groq: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error testing Groq API connection',
            'error': str(e)
        }), 500

@app.route('/api/openai/chat', methods=['POST'])
def proxy_gemini_chat():
    """Proxy Google Gemini API requests (OpenAI-compatible endpoint)"""
    try:
        print('🤖 Proxying request to Google Gemini API...')
        
        data = request.get_json()
        messages = data.get('messages')
        system_prompt = data.get('systemPrompt')
        user_input = data.get('userInput')
        
        # Validate request
        if not messages and not user_input:
            return jsonify({
                'success': False,
                'error': 'Missing required parameters: messages or userInput'
            }), 400
        
        # Build full prompt for Gemini (combines system + user)
        if user_input and system_prompt:
            full_prompt = f"{system_prompt}\n\nUser Request: {user_input}"
        elif messages:
            # Convert OpenAI messages format to single Gemini prompt
            full_prompt = ""
            for msg in messages:
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                if role == 'system':
                    full_prompt += f"System Instructions: {content}\n\n"
                elif role == 'user':
                    full_prompt += f"User Request: {content}\n\n"
        else:
            full_prompt = user_input or "Generate a response"
        
        # Gemini API URL with key
        url = f"{GEMINI_CONFIG['API_URL']}?key={GEMINI_CONFIG['API_KEY']}"
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        # Gemini API payload format
        payload = {
            'contents': [{
                'parts': [{
                    'text': full_prompt
                }]
            }],
            'generationConfig': {
                'temperature': GEMINI_CONFIG['TEMPERATURE'],
                'maxOutputTokens': GEMINI_CONFIG['MAX_TOKENS'],
                'topP': 0.95,
                'topK': 40
            }
        }
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        response_data = response.json()
        
        if response.status_code == 200:
            print('✅ Google Gemini API response received')
            
            # Extract response text from Gemini format
            gemini_text = ""
            if 'candidates' in response_data and len(response_data['candidates']) > 0:
                candidate = response_data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    parts = candidate['content']['parts']
                    if len(parts) > 0 and 'text' in parts[0]:
                        gemini_text = parts[0]['text']
            
            # Convert Gemini response to OpenAI-compatible format
            openai_compatible_response = {
                'choices': [{
                    'message': {
                        'role': 'assistant',
                        'content': gemini_text
                    },
                    'finish_reason': 'stop'
                }],
                'usage': {
                    'prompt_tokens': len(full_prompt.split()),
                    'completion_tokens': len(gemini_text.split()),
                    'total_tokens': len(full_prompt.split()) + len(gemini_text.split())
                },
                'model': 'gemini-2.0-flash-exp'
            }
            
            return jsonify({
                'success': True,
                'data': openai_compatible_response,
                'usage': openai_compatible_response['usage']
            })
        else:
            print(f'❌ Gemini API error: {response_data}')
            return jsonify({
                'success': False,
                'error': response_data.get('error', 'Gemini API error'),
                'status': response.status_code
            }), response.status_code
            
    except Exception as e:
        print(f'❌ Proxy server error: {str(e)}')
        return jsonify({
            'success': False,
            'error': f'Proxy server error: {str(e)}'
        }), 500

# NEW OPENROUTER ENDPOINTS
@app.route('/api/openrouter/chat', methods=['POST'])
def handle_openrouter_direct():
    """Direct OpenRouter AI proxy endpoint"""
    try:
        print('🤖 Proxying request to OpenRouter AI...')
        
        data = request.get_json()
        messages = data.get('messages')
        system_prompt = data.get('systemPrompt')
        user_input = data.get('userInput')
        model_key = data.get('model', 'gpt-4o-mini')  # Get the model key from request
        model = OPENROUTER_CONFIG['MODELS'].get(model_key, OPENROUTER_CONFIG['MODEL'])  # Map to actual model ID
        
        # Validate request
        if not messages and not user_input:
            return jsonify({
                'success': False,
                'error': 'Missing required parameters: messages or userInput'
            }), 400
        
        # Build OpenAI-compatible messages format
        if user_input and system_prompt:
            request_messages = [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_input}
            ]
        elif messages:
            request_messages = messages
        else:
            request_messages = [{'role': 'user', 'content': user_input or 'Generate a response'}]
        
        # OpenRouter API URL and headers
        url = OPENROUTER_CONFIG['API_URL']
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {OPENROUTER_CONFIG["API_KEY"]}',
            'HTTP-Referer': 'http://localhost:3001',
            'X-Title': 'AI Prompt Assistant'
        }
        
        # OpenRouter API payload (OpenAI-compatible)
        payload = {
            'model': model,
            'messages': request_messages,
            'max_tokens': data.get('max_tokens', OPENROUTER_CONFIG['MAX_TOKENS']),
            'temperature': data.get('temperature', OPENROUTER_CONFIG['TEMPERATURE']),
            'top_p': data.get('top_p', 0.95),
            'frequency_penalty': data.get('frequency_penalty', 0),
            'presence_penalty': data.get('presence_penalty', 0)
        }
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=45
        )
        
        response_data = response.json()
        
        if response.status_code == 200:
            print('✅ OpenRouter AI API response received')
            
            # Add provider info to response
            response_data['provider'] = 'openrouter'
            if 'model' not in response_data:
                response_data['model'] = model
            
            return jsonify({
                'success': True,
                'data': response_data,
                'usage': response_data.get('usage', {}),
                'provider': 'openrouter'
            })
        else:
            print(f'❌ OpenRouter API error: {response_data}')
            return jsonify({
                'success': False,
                'error': response_data.get('error', 'OpenRouter API error'),
                'status': response.status_code
            }), response.status_code
            
    except Exception as e:
        print(f'❌ OpenRouter proxy error: {str(e)}')
        return jsonify({
            'success': False,
            'error': f'OpenRouter proxy error: {str(e)}'
        }), 500

@app.route('/api/groq/chat', methods=['POST'])
def handle_groq_direct():
    """Direct Groq AI proxy endpoint"""
    try:
        print('🤖 Proxying request to Groq AI...')
        
        data = request.get_json()
        messages = data.get('messages')
        system_prompt = data.get('systemPrompt')
        user_input = data.get('userInput')
        model_key = data.get('model', 'llama-3.1-8b-instant')  # Get the model key from request
        model = GROQ_CONFIG['MODELS'].get(model_key, GROQ_CONFIG['MODEL'])  # Map to actual model ID
        
        # Validate request
        if not messages and not user_input:
            return jsonify({
                'success': False,
                'error': 'Missing required parameters: messages or userInput'
            }), 400
        
        # Build OpenAI-compatible messages format
        if user_input and system_prompt:
            request_messages = [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_input}
            ]
        elif messages:
            request_messages = messages
        else:
            request_messages = [{'role': 'user', 'content': user_input or 'Generate a response'}]
        
        # Groq API URL and headers
        url = GROQ_CONFIG['API_URL']
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GROQ_CONFIG["API_KEY"]}'
        }
        
        # Groq API payload (OpenAI-compatible)
        payload = {
            'model': model,
            'messages': request_messages,
            'max_tokens': data.get('max_tokens', GROQ_CONFIG['MAX_TOKENS']),
            'temperature': data.get('temperature', GROQ_CONFIG['TEMPERATURE']),
            'top_p': data.get('top_p', 0.95),
            'frequency_penalty': data.get('frequency_penalty', 0),
            'presence_penalty': data.get('presence_penalty', 0)
        }
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30  # Groq is very fast, shorter timeout
        )
        
        response_data = response.json()
        
        if response.status_code == 200:
            print('✅ Groq AI API response received')
            
            # Add provider info to response
            response_data['provider'] = 'groq'
            if 'model' not in response_data:
                response_data['model'] = model
            
            return jsonify({
                'success': True,
                'data': response_data,
                'usage': response_data.get('usage', {}),
                'provider': 'groq'
            })
        else:
            print(f'❌ Groq API error: {response_data}')
            return jsonify({
                'success': False,
                'error': response_data.get('error', 'Groq API error'),
                'status': response.status_code
            }), response.status_code
            
    except Exception as e:
        print(f'❌ Groq proxy error: {str(e)}')
        return jsonify({
            'success': False,
            'error': f'Groq proxy error: {str(e)}'
        }), 500

@app.route('/api/chat/universal', methods=['POST'])
def universal_chat_proxy():
    """Universal chat proxy - auto-select provider or use specified"""
    try:
        data = request.get_json()
        provider = data.get('provider', DEFAULT_PROVIDER)
        
        print(f'🤖 Universal proxy routing to: {provider.upper()}')
        
        if provider == 'openrouter':
            return handle_openrouter_direct()
        elif provider == 'gemini':
            return proxy_gemini_chat()
        elif provider == 'groq':
            return handle_groq_direct()
        else:
            return jsonify({
                'success': False,
                'error': f'Unsupported provider: {provider}. Available: openrouter, gemini, groq'
            }), 400
            
    except Exception as e:
        print(f'❌ Universal proxy error: {str(e)}')
        return jsonify({
            'success': False,
            'error': f'Universal proxy error: {str(e)}'
        }), 500

@app.route('/api/models', methods=['GET'])
def list_available_models():
    """List all available models from both providers"""
    return jsonify({
        'providers': {
            'openrouter': {
                'name': 'OpenRouter AI',
                'models': OPENROUTER_CONFIG['MODELS'],
                'default': OPENROUTER_CONFIG['MODEL'],
                'features': ['Multiple Models', 'GPT-4 Access', 'Claude Access', 'Pay-per-use']
            },
            'gemini': {
                'name': 'Google Gemini',
                'models': {'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp'},
                'default': GEMINI_CONFIG['MODEL'],
                'features': ['Free Tier', 'Fast Response', 'Google AI']
            }
        },
        'default_provider': DEFAULT_PROVIDER
    })

@app.route('/api/info')
def api_info():
    """API information"""
    return jsonify({
        'name': 'AI Prompt Assistant Proxy Server (Python)',
        'version': '2.0.0',
        'description': 'Triple-provider proxy server: Google Gemini + OpenRouter AI + Groq AI',
        'endpoints': {
            'health': 'GET /health',
            'testGemini': 'GET /api/test-openai',
            'testOpenRouter': 'GET /api/test-openrouter',
            'testGroq': 'GET /api/test-groq',
            'testAll': 'GET /api/test-all',
            'geminiChat': 'POST /api/openai/chat',
            'openrouterChat': 'POST /api/openrouter/chat',
            'groqChat': 'POST /api/groq/chat',
            'universalChat': 'POST /api/chat/universal',
            'listModels': 'GET /api/models',
            'info': 'GET /api/info'
        },
        'providers': {
            'gemini': {
                'model': GEMINI_CONFIG['MODEL'],
                'maxTokens': GEMINI_CONFIG['MAX_TOKENS'],
                'temperature': GEMINI_CONFIG['TEMPERATURE'],
                'features': ['Free Tier', 'Fast Response', 'High Quality']
            },
            'openrouter': {
                'model': OPENROUTER_CONFIG['MODEL'],
                'maxTokens': OPENROUTER_CONFIG['MAX_TOKENS'],
                'temperature': OPENROUTER_CONFIG['TEMPERATURE'],
                'features': ['Multiple Models', 'GPT-4 Access', 'Claude Access', 'Enterprise Grade']
            },
            'groq': {
                'model': GROQ_CONFIG['MODEL'],
                'maxTokens': GROQ_CONFIG['MAX_TOKENS'],
                'temperature': GROQ_CONFIG['TEMPERATURE'],
                'features': ['Super Fast Inference', 'Llama Models', 'Mixtral Support', 'Low Latency']
            }
        },
        'defaultProvider': DEFAULT_PROVIDER
    })

# ===== ERROR HANDLING =====
@app.errorhandler(500)
def handle_500(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': str(error)
    }), 500

# ===== START SERVER =====
if __name__ == '__main__':
    print('\n🚀 ================================================')
    print('🐍 AI Prompt Assistant Proxy Server v2.0 (Python)')
    print('🤖 Dual-Provider: Google Gemini + OpenRouter AI')
    print('🚀 ================================================')
    print(f'📡 Server running on: http://localhost:{PORT}')
    print(f'🔗 Main App: http://localhost:{PORT}/')
    print(f'📊 Health Check: http://localhost:{PORT}/health')
    print('')
    print('🧪 Test Endpoints:')
    print(f'   • Test Gemini: http://localhost:{PORT}/api/test-openai')
    print(f'   • Test OpenRouter: http://localhost:{PORT}/api/test-openrouter')
    print(f'   • Test All: http://localhost:{PORT}/api/test-all')
    print('')
    print('💬 Chat Endpoints:')
    print(f'   • Gemini Chat: POST /api/openai/chat')
    print(f'   • OpenRouter Chat: POST /api/openrouter/chat')
    print(f'   • Universal Chat: POST /api/chat/universal')
    print('')
    print('📝 Other Endpoints:')
    print(f'   • List Models: http://localhost:{PORT}/api/models')
    print(f'   • API Info: http://localhost:{PORT}/api/info')
    print('')
    print(f'🎯 Default Provider: {DEFAULT_PROVIDER.upper()}')
    print(f'🆓 Gemini: 15 requests/minute (Free)')
    print(f'💰 OpenRouter: Pay-per-use (GPT-4, Claude, Llama)')
    print('🚀 ================================================\n')
    
    # List all routes on startup for debugging
    print('\n📋 Available routes:')
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods - {'OPTIONS', 'HEAD'})
        print(f'  {methods:10} {rule.rule}')
    
    print('⏳ Will test OpenAI connection after server starts...')
    
    app.run(host='0.0.0.0', port=PORT, debug=True)
