var codeEditor1 = document.getElementById('codeEditor1');
var lineCounter1 = document.getElementById('lineCounter1');
var codeEditor2 = document.getElementById('codeEditor2');
var lineCounter2 = document.getElementById('lineCounter2');

class TextEditor {
	constructor(codeEditor, lineCounter) {
		this.codeEditor = codeEditor;
		this.lineCounter = lineCounter;
		this.lineCountCache =0;

		this.codeEditor.addEventListener('scroll', () => {
			this.lineCounter.scrollTop = codeEditor.scrollTop;
			this.lineCounter.scrollLeft = codeEditor.scrollLeft;
		});

		this.codeEditor.addEventListener('input', () => {
			this.line_counter();
		});

		this.codeEditor.addEventListener('keydown', (e) => {
			let { keyCode } = e;
			let { value, selectionStart, selectionEnd } = this.codeEditor;

			if (keyCode === 9) { 
				e.preventDefault();
				this.codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
				this.codeEditor.setSelectionRange(selectionStart+2, selectionStart+1)
			}
		});

		this.line_counter();
	}

	line_counter() 
	{
		let lineCount = this.codeEditor.value.split('\n').length;
		let outarr = new Array();
		if (this.lineCountCache != lineCount) {
			for (let x = 0; x < lineCount; x++) {
				outarr[x] = (x + 1) + '.';
			}
			this.lineCounter.value = outarr.join('\n');
		}
		this.lineCountCache = lineCount;
	}
}

let te1 = new TextEditor(codeEditor1, lineCounter1);
let te2 = new TextEditor(codeEditor2, lineCounter2);
let scrollsw = 0;

function compareText()
{
	function sqlCompare(code1, code2)
	{
		function scrollTo(textarea, position) {
			if (!textarea) { return; }
			if (position < 0) { return; }

			var body = textarea.value;
			if (body) {
				textarea.value = body.substring(0, position);
				textarea.scrollTop = position;
				textarea.value = body;
			}
		}

		let pos1=0;
		let pos2=0;
		let code1len = code1.value.length ;
		let code2len = code2.value.length ;
		let v1 = code1.value ;
		let v2 = code2.value ;

		function setSelectionRange(textarea, selectionStart, selectionEnd) 
		{
			const fullText = textarea.value;
			textarea.value = fullText.substring(0, selectionEnd);
			const scrollHeight = textarea.scrollHeight
			textarea.value = fullText;
			let scrollTop = scrollHeight;
			const textareaHeight = textarea.clientHeight;
			if (scrollTop > textareaHeight)
			{
				scrollTop -= textareaHeight / 2;
			} else
			{
				scrollTop = 0;
			}
			textarea.scrollTop = scrollTop;
			textarea.setSelectionRange(selectionStart, selectionEnd);
		}

		function scroll()
		{
			if (scrollsw ==0)
			{
				setSelectionRange(code1, pos1, pos1+1);
				setSelectionRange(code2, pos2, pos2+1);
				code1.focus();
				scrollsw =1;
			}
			else
			{
				setSelectionRange(code2, pos2, pos2+1);
				setSelectionRange(code1, pos1, pos1+1);
				code2.focus();
				scrollsw =0;
			}
		}

		function c1()
		{
			return v1.charAt(pos1).toLowerCase();
		}
		
		function c_1()
		{
			return v1.charAt(pos1);
		}

		function c1blank()
		{
			if (c1()==" ") return true;
			if (c1()=="\r") return true;
			if (c1()=="\n") return true;
			if (c1()=="\t") return true;
			return false;
		}

		function c2()
		{
			return v2.charAt(pos2).toLowerCase();
		}

		function c_2()
		{
			return v2.charAt(pos2);
		}

		function c2blank()
		{
			if (c2()==" ") return true;
			if (c2()=="\r") return true;
			if (c2()=="\n") return true;
			if (c2()=="\t") return true;
			return false;
		}

		function checkchar(c)
		{
			if (c1() == c  && c2()==c)
			{
				pos1++;
				pos2++;
				while (pos1< code1len && c1blank()) pos1++;
				while (pos2< code2len && c2blank()) pos2++;
				return true;
			} else
			if (c1() == c  && c2blank())
			{
				while (pos2< code2len && c2blank()) pos2++;
				return true;
			} else
			if (c2() == c && c1blank())
			{
				while (pos1< code1len && c1blank()) pos1++;
				return true;
			} 
			else
			return false;
		}

		while (1)
		{
			if (pos1 >= code1len) 
			{
				scroll();
				return ;
			}
			if (pos2 >= code2len) 
			{
				scroll();
				return ;
			}

			if (pos1 < code1len-1 && v1.substr(pos1,2)=='--')
			{
				pos1++;
				pos1++;
				while (pos1 < code1len && v1.charAt(pos1)!='\r' && v1.charAt(pos1)!='\n') pos1++;
				while (pos1 < code1len && c1blank()) pos1++;
			} else
			if (pos2 < code2len-1 && v2.substr(pos2,2)=='--')
			{
				pos2++;
				pos2++;
				while (pos2 < code2len && v2.charAt(pos2)!='\r' && v2.charAt(pos2)!='\n') pos2++;
				while (pos2 < code2len && c2blank()) pos2++;
			} else
			if (pos1 < code1len-1 && v1.substr(pos1,2)=='/*')
			{
				while (pos1 < code1len-1 && v1.substr(pos1,2)!='*/') pos1++;
				pos1++;
				pos1++;
				while (pos1< code1len && c1blank()) pos1++;
				while (pos2< code2len && c2blank()) pos2++;
			} else
			if (pos2 < code2len-1 && v2.substr(pos2,2)=='/*')
			{
				while (pos2 < code2len-1 && v2.substr(pos2,2)!='*/') pos2++;
				pos2++;
				pos2++;
				while (pos1< code1len && c1blank()) pos1++;
				while (pos2< code2len && c2blank()) pos2++;
			} else
			if (checkchar(','));else
			if (checkchar('('));else
			if (checkchar(')'));else
			if (checkchar('<'));else
			if (checkchar('>'));else
			if (checkchar('='));else
			if (checkchar('|'));else
			if (c1blank() && c2blank())
			{
				while (pos1< code1len && c1blank()) pos1++;
				while (pos2< code2len && c2blank()) pos2++;
			}
			else
			if (c1 () == '\'' && c2 () == '\'')
			{
				console.log('Tu');
				pos1++;
				pos2++;
				while (pos1 < code1len && pos2 < code2len && c_1() == c_2() && c_1() != '\'')
				{
					pos1++;
					pos2++;
				}
				if (pos1< code1len && c_1() =='\'' && pos2< code2len && c_2() =='\'')
				{
					pos1++;
					pos2++;
				} ;
				if ( pos1 < code1len)
				if ( pos2 < code2len)
				if (c1blank() && c2blank()) ;
				else
				if ( c_1 ()!=  c_2() )
				{
					scroll();
					return ;
				}
			} else
			if (c1 ()!=  c2())
			{
				if ( pos1 < code1len)
				if ( pos2 < code2len)
				if ( c1 ()!=  c2() )
				{
					scroll();
					return ;
				}
			} else
			{
				pos1++;
				pos2++;
			}
		}
	}

	sqlCompare(codeEditor1, codeEditor2);
	scroll();
}