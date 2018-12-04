package com.ydrx.wisdombank.controller;

import com.ydrx.wisdombank.vo.CardInfo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/transfer")
public class TransferController {

    @RequestMapping("/bankInfoEdit")
    @ResponseBody
    public Map<String, Object> checkCard(CardInfo cardInfo)
    {
        return null;
    }
}
