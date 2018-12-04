/**
 * 初始化
 */
window.onload = function() {
	InitWindow();
}

function InitWindow() {
	DumpException.StartCatch();
}

idcard.onEvent = function(cmd, args) {
	switch (cmd) {
	case 'OpenConnectionOver':
		show("open ok!");
		AcceptAndReadTracks();
		break;
	case 'AcceptAndReadTracksOver':
		show("卡读到FORM或者磁道数据");
		document.getElementById("begin").style.display = "none";
		document.getElementById("processdiv").style.display = "";
		var status = eval(args).chipdata.status;
		if (status == "DATAOK") {
			showCradInfo(eval(args).chipdata.datas);
		} else {
			show("读取身份证信息失败!");
		}
		show("读取完毕！");
		closedevice();
		document.getElementById("againbtn").style.display = "";
		break;
	case 'ResetOver':
		show("复位ok");
		break;
	case 'EjectOver':
		show("退卡OK!");
		break;
	case 'CardAccepted':
		show("读卡器读取到数据!");
		break;
	case 'CardInvalid':
		show("检测到非法磁道数据!");
		break;
	case 'CardAcceptCancelled':
		show("异步进卡被取消!");
		break;
	case 'CardTaken':
		show("卡片被取走!");
		break;
	case 'CloseConnectionOver':
		show("close ok!");
		document.getElementById("againbtn").style.display = "";
		break;
	case 'DeviceError':
		show("执行:" + args.cmdName + "出错" + args.errorcode);
		closedevice();
		break;
	case 'CardInserted':
		show("有卡插入!");
		break;
	case 'Timeout':
		show("操作" + args.cmdName + "超时");
		break;
	case 'ErrorInfoReceived':
		show("系统硬件错误:" + args);
		break;
	case 'StatusChanged':
		show("状态改变" + args.newStatus);
		break;
	default:
		show('cmd :' + cmd + ' args :' + args);
		break;

	}
}

/**
 * 打开设备
 */
function opendev() {
	show("正在连接设备－－－－－－－－");
	show("ServiceName:" + idcard.getAttribute('ServiceName'));
	idcard.OpenConnection('IDCardReader310', 0);
}

/**
 * 读取证件
 */
function AcceptAndReadTracks() {
	show("Reading......");
	idcard.setAttribute('StReadDataType', 0);
	var track = 8;
	var timeout = 0;
	idcard.AcceptAndReadTracks(track, timeout);

}

function closedevice() {
	show("正在关闭设备－－－－－－－－");
	idcard.CloseConnection();
}

/**
 * 重新测试
 */
function again() {
	document.getElementById("idinfo").value = "卡信息显示：";
	document.getElementById("processdiv").style.display = "none";
	document.getElementById("begin").style.display = "";
}

/**
 * 信息显示
 * 
 * @param {Object}
 *            str
 */
function show(str) {
	document.getElementById("msg").value = document.getElementById("msg").value
			+ '\n' + str;
	document.getElementById("msg").scrollTop = document.getElementById("msg").scrollHeight;
	document.getElementById("msg").scrollTop = document.getElementById("msg").scrollHeight;
}
/**
 * 卡信息显示
 * 
 * @param {Object}
 *            str
 */
function showCradInfo(str) {
	document.getElementById("idinfo").value = document.getElementById("idinfo").value
			+ '\n' + str;
	document.getElementById("idinfo").scrollTop = document
			.getElementById("idinfo").scrollHeight;
	document.getElementById("idinfo").scrollTop = document
			.getElementById("idinfo").scrollHeight;
}
