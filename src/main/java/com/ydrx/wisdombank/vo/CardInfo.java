package com.ydrx.wisdombank.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class CardInfo {
    private String cardType; //卡类型

    private String cardNo1; //卡号

    private String cardNo2; //确认卡号
}
