/**
 * 
 */
package com.ydrx.wisdombank.controller;

import com.ydrx.wisdombank.util.Constant;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

/**
 * @author：zqg
 *
 */
public class BaseController
{
	protected Logger logger = Logger.getLogger(this.getClass());

	public ModelAndView getModelView(){
		return new ModelAndView();
	}

	public ModelAndView getModelView(WebRequest request)
	{
		ModelAndView mv = new ModelAndView();
		Iterator<String> iterator = request.getParameterNames();
		String pName = "";
		// 将请求的参数再次转发下去
		while (iterator.hasNext())
		{
			pName = iterator.next();
			mv.addObject(pName, request.getParameter(pName));
		}
		return mv;
	}

	public Map<String, Object> ajaxSuccess(Map<String, Object> resultMap)
	{
		resultMap.put("statusCode", Constant.statusCode.HTTP_SUCCESS);
		return resultMap;
	}

	public Map<String, Object> ajaxError(Map<String, Object> resultMap)
	{
		resultMap.put("statusCode", Constant.statusCode.HTTP_ERROR);
		return resultMap;
	}
	
	/**
	 * 得到request对象
	 */
	public HttpServletRequest getRequest() {
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		return request;
	}
	
	/**
	 * 上传文件
	 * @return 返回文件名称 
	 */
	public String uploadFile(MultipartFile file, String filePath){
		if(file==null){
			throw new NullPointerException("上传文件不能为空!");
		}
		if(StringUtils.isBlank(filePath)){
			throw new NullPointerException("上传文件路径不能为空!");
		}
		String fileName = file.getOriginalFilename();  
        String extName = fileName.substring(fileName.lastIndexOf("."))
				.toLowerCase();
		String lastFileName = UUID.randomUUID().toString() + extName;
		File targetFile = new File(filePath, lastFileName);
        if(!targetFile.exists()){  
            targetFile.mkdirs();  
        }  
        try {
			file.transferTo(targetFile);
		}catch (IOException e) {
			throw new RuntimeException("上传文件失败:",e);
		}
		return lastFileName;
	}
	
	protected Map<String,Object> createErrorResultMap(Throwable e)
	{
		Map<String,Object> map = new HashMap<String, Object>();
		map.put("resultCode",Constant.BizConstant.RESULT_ERROR);
		map.put("message", e.getMessage());
		return map;
	}

}
