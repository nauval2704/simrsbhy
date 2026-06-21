import {
    Eb as o,
    Fb as g,
    ma as s,
    sc as u
} from "./chunk-UYVTZL26.js";
var h = (() => {
        class i {
            constructor() {
                this._printStyle = [], this.previewOnly = !1, this.useExistingCss = !1, this.printDelay = 0, this._styleSheetFile = ""
            }
            set printStyle(e) {
                for (let t in e) e.hasOwnProperty(t) && this._printStyle.push((t + JSON.stringify(e[t])).replace(/['"]+/g, ""));
                this.returnStyleValues()
            }
            returnStyleValues() {
                return `<style> ${this._printStyle.join(" ").replace(/,/g,";")} </style>`
            }
            set styleSheetFile(e) {
                let t = function(n) {
                    return `<link rel="stylesheet" type="text/css" href="${n}">`
                };
                if (e.indexOf(",") !== -1) {
                    let n = e.split(",");
                    for (let r of n) this._styleSheetFile = this._styleSheetFile + t(r)
                } else this._styleSheetFile = t(e)
            }
            returnStyleSheetLinkTags() {
                return this._styleSheetFile
            }
            getElementTag(e) {
                let t = [],
                    n = document.getElementsByTagName(e);
                for (let r = 0; r < n.length; r++) t.push(n[r].outerHTML);
                return t.join(`\r
`)
            }
            getFormData(e) {
                for (var t = 0; t < e.length; t++) e[t].defaultValue = e[t].value, e[t].checked && (e[t].defaultChecked = !0)
            }
            getHtmlContents() {
                let e = document.getElementById(this.printSectionId),
                    t = e.getElementsByTagName("input");
                this.getFormData(t);
                let n = e.getElementsByTagName("textarea");
                return this.getFormData(n), e.innerHTML
            }
            print() {
                let e, t, n = "",
                    r = "",
                    a = this.getElementTag("base");
                this.useExistingCss && (n = this.getElementTag("style"), r = this.getElementTag("link")), e = this.getHtmlContents(), t = window.open("", "_blank", "top=0,left=0,height=auto,width=auto"), t.document.open(), t.document.write(`
      <html>
        <head>
          <title>${this.printTitle?this.printTitle:""}</title>
          ${a}
          ${this.returnStyleValues()}
          ${this.returnStyleSheetLinkTags()}
          ${n}
          ${r}
        </head>
        <body>
          ${e}
          <script defer>
            function triggerPrint(event) {
              window.removeEventListener('load', triggerPrint, false);
              ${this.previewOnly?"":`setTimeout(function() {
                closeWindow(window.print());
              }, ${this.printDelay});`}
            }
            function closeWindow(){
                window.close();
            }
            window.addEventListener('load', triggerPrint, false);
          <\/script>
        </body>
      </html>`), t.document.close()
            }
        }
        return i.\u0275fac = function(e) {
            return new(e || i)
        }, i.\u0275dir = g({
            type: i,
            selectors: [
                ["button", "ngxPrint", ""]
            ],
            hostBindings: function(e, t) {
                e & 1 && u("click", function() {
                    return t.print()
                })
            },
            inputs: {
                previewOnly: "previewOnly",
                printSectionId: "printSectionId",
                printTitle: "printTitle",
                useExistingCss: "useExistingCss",
                printDelay: "printDelay",
                printStyle: "printStyle",
                styleSheetFile: "styleSheetFile"
            },
            standalone: !1
        }), i
    })(),
    c = (() => {
        class i {}
        return i.\u0275fac = function(e) {
            return new(e || i)
        }, i.\u0275mod = o({
            type: i
        }), i.\u0275inj = s({}), i
    })();
export {
    h as a, c as b
};