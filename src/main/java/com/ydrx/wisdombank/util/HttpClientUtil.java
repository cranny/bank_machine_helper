package com.ydrx.wisdombank.util;
import java.io.IOException;
import java.io.InterruptedIOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Map;

import javax.net.ssl.SSLException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
/**
 * HttpClient4.5工具类
 * @author liangrh
 *
 */
public class HttpClientUtil {
	 private static PoolingHttpClientConnectionManager cm;  
	    private static String EMPTY_STR = "";  
	    public static final String UTF_8 = "UTF-8";  
	  
	    private static void init() {  
	        if (cm == null) {  
	            cm = new PoolingHttpClientConnectionManager();  
	            cm.setMaxTotal(50);// 整个连接池最大连接数  
	            cm.setDefaultMaxPerRoute(30);// 每路由最大连接数，默认值是2  
	        }  
	    }  
	  
	    /** 
	     * 通过连接池获取HttpClient 
	     *  
	     * @return 
	     */  
	    private static CloseableHttpClient getHttpClient() {  
	        init();
	        //自定义请求重试HANDLER
	        HttpRequestRetryHandler customRetryHandler = new HttpRequestRetryHandler(){
				@Override
				public boolean retryRequest(IOException exception,
						int executionCount, HttpContext context) {
					if (executionCount >= 5) {  
			            // Do not retry if over max retry count  
			            return false;  
			        }  
			        if (exception instanceof InterruptedIOException) {  
			            // Timeout  
			            return false;  
			        }  
			        if (exception instanceof UnknownHostException) {  
			            // Unknown host  
			            return false;  
			        }  
			        if (exception instanceof ConnectTimeoutException) {  
			            // Connection refused  
			            return false;  
			        }  
			        if (exception instanceof SSLException) {  
			            // SSL handshake exception  
			            return false;  
			        }  
			        HttpClientContext clientContext = HttpClientContext.adapt(context);  
			        HttpRequest request = clientContext.getRequest();  
			        boolean idempotent = !(request instanceof HttpEntityEnclosingRequest);  
			        if (idempotent) {  
			            // Retry if the request is considered idempotent  
			            return true;  
			        }  
			        return false;  
				}
	        };
	        return HttpClients.custom().setConnectionManager(cm).setRetryHandler(customRetryHandler).build();  
	    }  
	  
	    /** 
	     *  
	     * @param url 
	     * @return 
	     */  
	    public static String httpGetRequest(String url) {  
	        HttpGet httpGet = new HttpGet(url);  
	        return getResult(httpGet);  
	    }  
	  
	    public static String httpGetRequest(String url, Map<String, Object> params) throws URISyntaxException {  
	        URIBuilder ub = new URIBuilder();  
	        ub.setPath(url);  
	  
	        ArrayList<NameValuePair> pairs = covertParams2NVPS(params);  
	        ub.setParameters(pairs);  
	  
	        HttpGet httpGet = new HttpGet(ub.build());  
	        return getResult(httpGet);  
	    }  
	    
	    public static byte[] httpGetRequestToByteArray(String url, Map<String, Object> params) throws URISyntaxException {  
	        URIBuilder ub = new URIBuilder();  
	        ub.setPath(url);  
	        ArrayList<NameValuePair> pairs = covertParams2NVPS(params);  
	        ub.setParameters(pairs);  
	  
	        HttpGet httpGet = new HttpGet(ub.build());  
	        return getResultToByteArray(httpGet);  
	    }  
	    
	    public static byte[] httpGetRequestToByteArray(String url, Map<String, Object> headers, Map<String, Object> params)  
	            throws URISyntaxException {  
	        URIBuilder ub = new URIBuilder();  
	        ub.setPath(url);
	        if(params!=null){
	        	ArrayList<NameValuePair> pairs = covertParams2NVPS(params);  
		        ub.setParameters(pairs);
	        }
	        HttpGet httpGet = new HttpGet(ub.build());  
	        if(headers!=null){
	        	for (Map.Entry<String, Object> param : headers.entrySet()) {  
		            httpGet.addHeader(param.getKey(), String.valueOf(param.getValue()));  
		        }  	
	        }
	        return getResultToByteArray(httpGet);  
	    }
	  
	    public static String httpGetRequest(String url, Map<String, Object> headers, Map<String, Object> params)  
	            throws URISyntaxException {  
	        URIBuilder ub = new URIBuilder();  
	        ub.setPath(url);
	        if(params!=null){
	        	ArrayList<NameValuePair> pairs = covertParams2NVPS(params);  
		        ub.setParameters(pairs);
	        }
	        HttpGet httpGet = new HttpGet(ub.build());  
	        if(headers!=null){
	        	for (Map.Entry<String, Object> param : headers.entrySet()) {  
		            httpGet.addHeader(param.getKey(), String.valueOf(param.getValue()));  
		        }  	
	        }
	        
	        return getResult(httpGet);  
	    }  
	  
	    public static String httpPostRequest(String url) {  
	        HttpPost httpPost = new HttpPost(url);  
	        return getResult(httpPost);  
	    }  
	  
	    public static String httpPostRequest(String url, Map<String, Object> params) throws UnsupportedEncodingException {  
	        HttpPost httpPost = new HttpPost(url);  
	        ArrayList<NameValuePair> pairs = covertParams2NVPS(params);  
	        httpPost.setEntity(new UrlEncodedFormEntity(pairs, UTF_8));  
	        return getResult(httpPost);  
	    }  
	  
	    public static String httpPostRequest(String url, Map<String, Object> headers, Map<String, Object> params)  
	            throws UnsupportedEncodingException {  
	        HttpPost httpPost = new HttpPost(url);  
	  
	        for (Map.Entry<String, Object> param : headers.entrySet()) {  
	            httpPost.addHeader(param.getKey(), String.valueOf(param.getValue()));  
	        }  
	  
	        ArrayList<NameValuePair> pairs = covertParams2NVPS(params);  
	        httpPost.setEntity(new UrlEncodedFormEntity(pairs, UTF_8));  
	        return getResult(httpPost);  
	    }
	    /**
	     * request-body方式是在request-body中提供参数，此方式只能用于进行POST请求。
	     * 在HttpClient程序包中有两个类可以完成此项工作，它们分别是UrlEncodedFormEntity类与MultipartEntity,ByteArrayEntity类。这 两个类均实现了HttpEntity接口
	     * @param url
	     * @param headers
	     * @param requestBody
	     * @return
	     * @throws UnsupportedEncodingException
	    */
	    public static String httpPostRequest(String url, Map<String, Object> headers,String requestBody)  
	            throws UnsupportedEncodingException {  
	    	HttpPost httpPost = new HttpPost(url); 
	        for (Map.Entry<String, Object> param : headers.entrySet()) {  
	            httpPost.addHeader(param.getKey(), String.valueOf(param.getValue()));  
	        }  
	        HttpEntity entity = new ByteArrayEntity(requestBody.getBytes(UTF_8));
	        httpPost.setEntity(entity);
	        return getResult(httpPost);  
	    }
	    
	    public static byte[] httpPostRequestToByteArray(String url, Map<String, Object> headers,String requestBody)  
	            throws UnsupportedEncodingException {  
	    	HttpPost httpPost = new HttpPost(url); 
	        for (Map.Entry<String, Object> param : headers.entrySet()) {  
	            httpPost.addHeader(param.getKey(), String.valueOf(param.getValue()));  
	        }  
	        HttpEntity entity = new ByteArrayEntity(requestBody.getBytes(UTF_8));
	        httpPost.setEntity(entity);
	        return getResultToByteArray(httpPost);  
	    }
	    
	    /**
	     * request-body方式是在request-body中提供参数，此方式只能用于进行POST请求。
	     * 在HttpClient程序包中有两个类可以完成此项工作，它们分别是UrlEncodedFormEntity类与MultipartEntity,ByteArrayEntity类。这 两个类均实现了HttpEntity接口
	     * @param url
	     * @param requestBody
	     * @return
	     * @throws UnsupportedEncodingException
	    */
	    public static String httpPostRequest(String url,String requestBody)  
	            throws UnsupportedEncodingException {  
	    	HttpPost httpPost = new HttpPost(url); 
	        HttpEntity entity = new ByteArrayEntity(requestBody.getBytes(UTF_8));
	        httpPost.setEntity(entity);
	        return getResult(httpPost);  
	    }
	    
	    private static ArrayList<NameValuePair> covertParams2NVPS(Map<String, Object> params) {  
	        ArrayList<NameValuePair> pairs = new ArrayList<NameValuePair>();  
	        for (Map.Entry<String, Object> param : params.entrySet()) {  
	            pairs.add(new BasicNameValuePair(param.getKey(), String.valueOf(param.getValue())));  
	        }  
	        return pairs;  
	    }  
	  
	    /** 
	     * 处理Http请求 
	     *  
	     * @param request 
	     * @return 
	     */  
	    public static String getResult(HttpRequestBase request) {  
	        // CloseableHttpClient httpClient = HttpClients.createDefault();  
	        CloseableHttpClient httpClient = getHttpClient();  
	        CloseableHttpResponse response = null;
	        try {  
	        	response = httpClient.execute(request);  
	            // response.getStatusLine().getStatusCode();  
	            HttpEntity entity = response.getEntity();  
	            if(response == null || response.getStatusLine().getStatusCode() != 200){
	            	throw new RuntimeException("do post request fail,request url=" + request.getURI());
	            }
	            if (entity != null) {  
	                // long len = entity.getContentLength();// -1 表示长度未知  
	                String result = EntityUtils.toString(entity);
	                // httpClient.close();  
	                return result;  
	            }  
	        } catch (Exception e) {  
	            throw new RuntimeException(e);
	        } finally {  
	        	if(response != null){
	        		try{
	        			response.close();
	        		}catch(IOException e){
	        		}
	        	}
//	        	if(httpClient != null){
//	        		try{
//	        			httpClient.close();
//	        		}catch(IOException e){
//	        		}
//	        	}
	        }  
	        return EMPTY_STR;  
	    }
	    
	    /** 
	     * 处理Http请求 
	     *  
	     * @param request 
	     * @return 
	     */  
		public static byte[] getResultToByteArray(HttpRequestBase request) {  
	        // CloseableHttpClient httpClient = HttpClients.createDefault();  
	        CloseableHttpClient httpClient = getHttpClient();  
	        try {  
	            CloseableHttpResponse response = httpClient.execute(request);  
	            // response.getStatusLine().getStatusCode();  
	            HttpEntity entity = response.getEntity();  
	            if (entity != null) {  
	                // long len = entity.getContentLength();// -1 表示长度未知  
	            	byte[] result = EntityUtils.toByteArray(entity);
	                response.close();  
	                // httpClient.close();  
	                return result;  
	            }  
	        } catch (ClientProtocolException e) {  
	            e.printStackTrace();  
	        } catch (IOException e) {  
	            e.printStackTrace();  
	        } finally {  
	        }
			return null;  
	    }
}  
