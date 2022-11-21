import * as xlsx from 'xlsx-js-style'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/* eslint-disable */
export default class Utils {
    static converDateFormat = (str, exp) => {
        let timestamp = Date.parse(str)
        if (isNaN(timestamp) === true) return str

        const strDate = new Date(str)
        // const localDate = new Date(strDate.getTime() + strDate.getTimezoneOffset() * 60 * 1000)

        const year = strDate.getFullYear()
        const month = strDate.getMonth() + 1 < 10 ? '0' + (strDate.getMonth() + 1) : '' + (strDate.getMonth() + 1)
        const date = strDate.getDate() < 10 ? '0' + strDate.getDate() : '' + strDate.getDate()
        return year + exp + month + exp + date
    }

    static addClass = (e, c) => {
        let cn = e.className
        if (cn.indexOf(c) !== -1) return
        if (cn !== '') c = ' ' + c
        e.className = cn + c
    }

    static removeClass = (e, c) => {
        e.className = e.className.replace(new RegExp('(?:^|s)' + c + '(?!S)'), '')
    }

    static hasClass = (e, c) => {
        return (' ' + e.className + ' ').indexOf(' ' + c + ' ') > -1
    }

    // 숫자값 체크. (true : 숫자가 아닌값 포함됨.)
    static strNumberCheck = (str) => {
        let regexp = /^[0-9]*$/
        if (!regexp.test(str)) return true
        return false
    }

    // 연속된 숫자, 같은 숫자 체크. 123456 OR 111111 (true: 연속된 숫자 및 반복된 숫자열)
    static strValidCheck = (str, maxLen) => {
        if (!maxLen) maxLen = 6 // 글자수를 지정하지 않으면 6로 지정
        let i, j, x, y
        let buff = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
        let src,
            src2,
            ptn = ''
        for (i = 0; i < buff.length; i++) {
            src = buff[i] // 0123456789
            src2 = buff[i] + buff[i] // 01234567890123456789
            for (j = 0; j < src.length; j++) {
                x = src.substr(j, 1) // 0
                y = src2.substr(j, maxLen) // 0123
                ptn += '[' + x + ']{' + maxLen + ',}|' // [0]{4,}|0123|[1]{4,}|1234|...
                ptn += y + '|'
            }
        }
        ptn = new RegExp(ptn.replace(/.$/, '')) // 맨마지막의 글자를 하나 없애고 정규식으로 만든다.
        if (ptn.test(str)) return true
        return false
    }

    static getQueryVariable = (variable) => {
        let query = window.location.search.substring(1)
        let vars = query.split('&')
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=')
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1])
            }
        }
    }

    // 숫자를 10000단위로 표시, 10000 이하는 소수점 첫째자리까지표시
    static roundingDown10000 = (number) => {
        if (number >= 10000) return Math.floor(number/10000);
        else if (number > 0) return (number/10000).toFixed(1);
        else return number;
    }

    static createFileName = function (preName, fileName) {
        function s4() {
            return '_' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        let resultStr = preName + s4() + s4() + s4()
        resultStr += fileName.substring(fileName.lastIndexOf('.'))
        return resultStr
    }

    static webkitHandlersTitle = function (title) {
        // WebView 상단 타이틀 변경.
        let jsonData = { title: title }
        let strJsonData = JSON.stringify(jsonData)
        try {
            // AOS
            window.android.setTitle(title)
        } catch (error) {}
        try {
            // iOS
            window.webkit.messageHandlers.iOSClient.postMessage(strJsonData)
        } catch (error) {
            console.log(title, ' : ', error)
        }
    }

    static numberComma = function (x) {
        return x ? x.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') : x
    }

    /**
     * 만 14세 미만 체크
     * @param birthDate yyyyMMdd
     * @param age 기준나이
     * @returns true: 만 {age}세 미만
     */
    static isAgeCheck = (birthDate, age) => {
        let today = new Date()
        let yyyy = today.getFullYear()
        let mm = today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1
        let dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
        return parseInt(yyyy + mm + dd) - parseInt(birthDate) - age * 10000 < 0
    }

    //pc, mobile chack script (sample code)
    static checkPlatform(ua) {
        if (ua === undefined) {
            ua = window.navigator.userAgent
        }

        ua = ua.toLowerCase()
        let platform = {}
        let matched = {}
        let userPlatform = 'pc'
        let platform_match =
            /(ipad)/.exec(ua) ||
            /(ipod)/.exec(ua) ||
            /(windows phone)/.exec(ua) ||
            /(iphone)/.exec(ua) ||
            /(kindle)/.exec(ua) ||
            /(silk)/.exec(ua) ||
            /(android)/.exec(ua) ||
            /(win)/.exec(ua) ||
            /(mac)/.exec(ua) ||
            /(linux)/.exec(ua) ||
            /(cros)/.exec(ua) ||
            /(playbook)/.exec(ua) ||
            /(bb)/.exec(ua) ||
            /(blackberry)/.exec(ua) ||
            []

        matched.platform = platform_match[0] || ''

        if (matched.platform) {
            platform[matched.platform] = true
        }

        if (
            platform.android ||
            platform.bb ||
            platform.blackberry ||
            platform.ipad ||
            platform.iphone ||
            platform.ipod ||
            platform.kindle ||
            platform.playbook ||
            platform.silk ||
            platform['windows phone']
        ) {
            userPlatform = 'mobile'
        }

        if (platform.cros || platform.mac || platform.linux || platform.win) {
            userPlatform = 'pc'
        }

        return userPlatform
    }

    static loadScript(src) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script')
            script.src = src

            script.onload = () => resolve(script)
            script.onerror = () => reject(new Error(`${src}를 불러오는 도중에 에러가 발생함`))

            document.head.append(script)
        })
    }

    static setToken = (sToken) => {
        sessionStorage.setItem("login_token",sToken);
    }
     
    static getToken = () => {
        return sessionStorage.getItem("login_token");
    }
     
    static removeToken = () => {
        sessionStorage.removeItem("login_token");
        localStorage.removeItem("userID");
        localStorage.removeItem("userNm");
        localStorage.removeItem("userNo");
    }
    
    static chkToken = () => {
        if(sessionStorage.getItem("login_token") === null || sessionStorage.getItem("login_token") === "null" || sessionStorage.getItem("login_token") === "") {
            return false;	    			
        } else {
            return true;
        } 
    }

    static calculateVat = (charge) => {
        
        const vatRate = 0.09;
        const vat = charge * vatRate;
        return [charge - vat, vat, charge];
    }

    // 엑셀 다운로드
    /* Parameter
    const options = {
        type: 'table', // 필수 O
        sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
        colspan: TABLE_COLUMN_INFO.width.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
        // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
        sheetName: 'test', // 시트이름, 필수 X
        addRowColor: { row: [1,2,3], color: ['d3d3d3','d3d3d3','d3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
        addLineHeader: ['발행\n일시'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
    };
    */
    static excelDownload = (downloadDatas, options, fileName) => {

        // 엑셀 워크북 생성
        const book = xlsx.utils.book_new();

        // 엑셀 워크시트 추가함수
        const addSheet = (index) => {
            let workSheet; // any

            let [downloadData, type, sheetOption = {}, colspan = [], rowspan = [], workSheetName = '', addRowColor = { row: [], color: [] }, addLineHeader = []]
            = [downloadDatas, options.type, options.sheetOption, options.colspan, options.rowspan, options.sheetName, options.addRowColor, options.addLineHeader];

            // 워크시트 여러개인 경우
            if (index) [downloadData, type, sheetOption = {}, colspan = [], rowspan = [], workSheetName = '', addRowColor = { row: [], color: [] }, addLineHeader = []]
            = [downloadDatas[index], options[index].type, options[index].sheetOption, options[index].colspan, options[index].rowspan, options[index].sheetName, options[index].addRowColor, options[index].addLineHeader];
            
            switch (type.toLowerCase()) {
                case 'table':
                    workSheet = xlsx.utils.table_to_sheet(downloadData, { ...sheetOption, raw: true });
                    // console.log('여기1', workSheet);
                    break;
                case 'array': // const file1 = [ ["이름", "나이"], ["장민우", "31"], ]
                    workSheet = xlsx.utils.aoa_to_sheet(downloadData, sheetOption);
                    break;
                case 'object': // const file2 = [ { A: "학과", B: "직급", C: "이름", D: "나이" }, { A: "흉부외과", B: "의사", C: "장민우", D: "31" }, ]
                    workSheet = xlsx.utils.json_to_sheet(downloadData, sheetOption);
                    break;
                default:
                    return;
            }

            // 병합할 셀 영역 설정
            if (options.merges) workSheet['!merges'] = { ...workSheet['!merges'], ...options.merges };

            const { origin = 'A1', outline } = sheetOption;
            const { c: originCol, r: originRow } = xlsx.utils.decode_cell(origin);
            // 셀 너비 설정
            if (!(origin === 'A1')) { // A1 셀에서 시작하지 않을 때 빈 셀 너비 설정 추가
                for (let index = 0; index < originCol; index++) {
                    workSheet['!cols'].push({ wpx: 40 });
                };
            };
            workSheet['!cols'] = [ ...workSheet['!cols'], ...colspan ];

            // 셀 높이 설정
            workSheet['!rows'] = [ ...workSheet['!rows'], ...rowspan ];

            // 세부사항 아래 통계행 추가
            if(outline) workSheet['!outline'] = outline;

            // 엑셀 테두리 설정 + addRowColorCellGroup 행의 셀 이름 수집
            const defaultBorderStyle = { style: "thin", color: { rgb: "#000000" } };
            const border = { top: defaultBorderStyle, bottom: defaultBorderStyle, left: defaultBorderStyle, right: defaultBorderStyle };
            const cellRange = xlsx.utils.decode_range(workSheet["!ref"]);

            const { row:rowNums, color:rowColors } = addRowColor;
            let addRowColorCellGroup = {};
            rowNums?.forEach(row => addRowColorCellGroup[row] = []);
            for (let row = originRow; row <= cellRange.e.r; row++) {
                for (let col = originCol; col <= cellRange.e.c; col++) {
                    const cellName = xlsx.utils.encode_cell({ c: col, r: row });
                    // console.log(cellName);
                    workSheet[cellName] = { ...workSheet[cellName], s: { border }, v:workSheet[cellName]?.v || ''  }; // 테두리 설정
                    if(rowNums.length > 0 && rowNums.includes((row + 1 - originRow)) && originCol <= col) addRowColorCellGroup[(row + 1 - originRow)].push(cellName); // addRowColorCellGroup 수집
                };
            };
            // console.log(addRowColorCellGroup);
            
            // 엑셀 정렬 스타일 추가 - 문자열: 가운데 정렬, 자동줄바꿈 / 숫자: 오른쪽 정렬, 3자리마다 ',' 표시
            const isSellAddress  = /[A-Z]{1,3}\d{1,5}/;
            const isAmount = /^([0-9]{1,3}(,[0-9]{3})*)$|%|\d개|\d원$|\dP$|\d장|^\+|^\-/;
            const checkAddLineHeader = addLineHeader.map(item => item?.replace('\n', ' ')); // 라인 추가할 헤더 체크값 변환
            Object.entries(workSheet).reduce((res, cur) => {
                const key = cur[0];
                const value = cur[1];
                // if (isSellAddress.test(key) && (isAmount.test(value.v))) console.log(key, value);
                // if(isSellAddress.test(key) && isAmount.test(value.v)) res[key].t = 'n'; // 금액 타입 숫자로 변경 - 저장 후 파일 열면 에러 메세지 발생(내용에만 문제 없음)
                // if (value.t && isSellAddress.test(key)) res[key] = value.t !== 'n' ? { ...value, s: { ...value.s, alignment: { vertical: "center", horizontal: "center", wrapText: true } } } : { ...value, z: "#,##0", s: { ...value.s, alignment: { vertical: "center", horizontal: "right" } } };
                if (value.t && isSellAddress.test(key)) res[key] = isAmount.test(value.v) ? { ...value, s: { ...value.s, alignment: { vertical: "center", horizontal: "right", wrapText: true } } } : { ...value, s: { ...value.s, alignment: { vertical: "center", horizontal: "center", wrapText: true } } };
                // addRowColor 행의 색상 추가
                rowNums?.forEach((rowNum, index) => {
                    if (addRowColorCellGroup[rowNum].includes(key)) res[key].s = { ...res[key].s, fill: { fgColor: { rgb: rowColors[index] || 'd3d3d3' } }};
                });
                if (!value.v && value.t && value.t === 'z') res[key].t = 's'; // 빈 데이터(공백) 타입 문자열로 변경
                if (checkAddLineHeader.length > 0 && checkAddLineHeader.indexOf(value.v) >= 0) res[key].v = addLineHeader[checkAddLineHeader.indexOf(value.v)];
                return res;
            }, workSheet);
            
            // console.log('final', workSheet);
            xlsx.utils.book_append_sheet(book, workSheet, workSheetName);
        }

        try {
            // 워크시트 여러개 추가
            if (typeof types === Array && types.length > 1) {
                downloadDatas.forEach((downloadData, index) => {
                    addSheet(index);
                })
            }
            else {
                addSheet();
            };

            xlsx.writeFile(book, fileName + '.xlsx');
        }
        catch (error) {
            console.log(error);
            // alert('엑셀 다운로드에 실패했습니다.\n관리자에게 문의해주세요');
        };
    }

    // 휴대폰 번호 뒷 4자리 *표 처리
    static phoneNumberEncryption = (phone) => {
        let result = '';
        for(let i=0;i<=phone.length-1;i++) {
            let currentNumber = '';
            if (i >= phone.length-4) currentNumber = '*'; // 4자리 *표
            else currentNumber = phone[i];
            result += currentNumber;
        }
        return result;
    }

    // PDF 다운로드 - CalculateListTable.tsx
    /* Parameter
    interface pdfInfo {
        orientation?: "portrait" | "p" | "l" | "landscape" | undefined, // 'landscape - 가로, 'portrait - 세로
        pdfUnit?: "mm" | "pt" | "px" | "in" | "cm" | "ex" | "em" | "pc" | undefined,
        pdfFormat?: string | number[] | undefined,
        imgFormat?: 'png', 'jpeg', ...
        xPadding?: number, // 프린트 좌우 들여쓰기
        yPadding?: number, // 프린트 위아래 들여쓰기
    };
    interface imgInfo {
        pageWidth?: number, // 이미지 가로 길이(mm) A4 기준 210
        pageHeight?: number, // 출력 페이지 세로 길이 A4 기준 297
        canvasHeight?: number, // 한 페이지에 담을 캔버스 이미지 높이
    };
    */
    static downloadPdf = async ({ element, fileName = 'donwloadPDF', pdfInfo = {}, imgInfo = {}, canvasOption = { useCORS: true } }) => {
        let { orientation = 'portrait', pdfUnit = 'mm', pdfFormat = 'a4', imgFormat = 'jpeg', xPadding = 10, yPadding = 10 } = { ...pdfInfo };
        let { pageWidth = 210, canvasHeight = 0, pageHeight = 297 } = { ...imgInfo };

        let pdf = new jsPDF(orientation, pdfUnit, pdfFormat, true);

        let innerPageWidth = pageWidth - xPadding * 2;
        let innerPageHeight = pageHeight - yPadding * 2;

        try {
            if (Array.isArray(element) && element.length > 1) { // Element n개로 n페이지 생성
                const standardHeight = element.reduce((acc, cur, index, arr) => { // 마지막 페이지 캔버스 높이 계산에 필요한 평균 캔버스 높이 계산
                    if (index < arr.length - 1) return acc += cur.scrollHeight; // 마지막 페이지 제외하고 높이 더하기
                    else return acc / (arr.length - 1); // 마지막 페이지 제외하고 평균 캔버스 높이 계산
                }, 0);

                const makePDF = async (element, makePage = false, isFinal = true) => {
                    const canvasArr = await Promise.all(element.map(el => html2canvas(el, canvasOption))); // 캔버스 배열 생성

                    canvasArr.forEach((canvas, page) => { // pdf 페이지 추가
                        const imgData = canvas.toDataURL('image/' + imgFormat);

                        if (page > 0 || makePage) pdf.addPage();
                        if (isFinal && page === canvasArr.length - 1) innerPageHeight = Math.floor(innerPageHeight * (canvasArr[canvasArr.length - 1].height / standardHeight)); // 마지막 페이지의 높이 계산 
                        pdf.addImage(imgData, imgFormat, xPadding, yPadding, innerPageWidth, innerPageHeight, '', 'FAST');
                    });
                };

                const chunkCnt = 10;
                if (element.length > chunkCnt) { // Element 크기가 chunkCnt 보다 클 때
                    const elementChunks = this.splitToChunks(element, Math.ceil(element.length / chunkCnt)); // Element 균등 분할
                    let index = 0;
                    // console.log('start', new Date());
                    for (const chunk of elementChunks) {
                        const makePage = index > 0;
                        const isFinal = index === elementChunks.length - 1; // 마지막 chunk 여부
                        await makePDF(chunk, makePage, isFinal);
                        index++;
                    };
                    // console.log('finish', new Date());
                } else {
                    await makePDF(element);
                };

            }
            else { // Element 1개로 n페이지 생성
                if (Array.isArray(element)) element = element[0];
                const canvas = await html2canvas(element, canvasOption); // useCORS: true -> element 내부에 있는 img Tag 같이 저장

                let totalHeight = canvas.height; // 전체 이미지 높이
                canvasHeight = !!canvasHeight ? canvasHeight : Math.floor(canvas.width * (pageHeight / pageWidth));  // 한 페이지에 담을 캔버스 이미지 높이
                let nPages = Math.ceil(totalHeight / canvasHeight); // 페이지 개수 계산

                // 한 페이지용 캔버스 생성
                const pageCanvas = document.createElement('canvas');
                const pageCtx = pageCanvas.getContext('2d');
                pageCanvas.width = canvas.width; // 기존 이미지 너비
                pageCanvas.height = canvasHeight; // 계산한 한 페이지 높이

                for (let page = 0; page < nPages; page++) {
                    // 여러 페이지의 경우 마지막 페이지 캔버스 크기 수정
                    if (page === nPages - 1 && totalHeight % canvasHeight !== 0) {
                        pageCanvas.height = totalHeight % canvasHeight;
                        innerPageHeight = innerPageWidth * (pageCanvas.height / pageCanvas.width);
                    };

                    // 한 페이지 크기만 페이지용 캔버스에 그리기
                    const w = pageCanvas.width;
                    const h = pageCanvas.height;
                    pageCtx.fillStyle = 'white';
                    pageCtx.fillRect(0, 0, w, h);
                    pageCtx.drawImage(canvas, 0, page * canvasHeight, w, h, 0, 0, w, h);
                    const imgData = pageCanvas.toDataURL('image/' + imgFormat);

                    // PDF에 페이지 추가
                    if (page > 0) pdf.addPage();
                    pdf.addImage(imgData, imgFormat, xPadding, yPadding, innerPageWidth, innerPageHeight);
                }
            };

            pdf.save(fileName);
        }
        catch (error) {
            console.log(error);
            alert('PDF 다운로드에 실패했습니다.')
        };
    };

    // 날짜가 어떤 요일인지 알려주기
    static getDayName = (date) => {
        // validation: string | Date
        let dateValue;
        if (typeof date === 'string') dateValue = new Date(date);
        else if (typeof date !== Date) return '';

        let dayNum = dateValue.getDay(); // 요일 숫자
        let dayText = '';                // 요일명

		switch (dayNum) {
			case 0: dayText = '일';	break;
			case 1: dayText = '월';	break;
			case 2: dayText = '화';	break;
			case 3: dayText = '수';	break;
			case 4: dayText = '목';	break;
			case 5: dayText = '금';	break;
			default: dayText = '토'; break;
		}
        return dayText;
    }
}
