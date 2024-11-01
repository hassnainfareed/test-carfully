export interface MailBaseParams {
  title: string;
  content: string;
}

export default function MailBase(mailBaseParams: MailBaseParams): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title></title>
    <style type="text/css">
      .ReadMsgBody {
        width: 100%;
        background-color: #ffffff;
      }
      .ExternalClass {
        width: 100%;
        background-color: #ffffff;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      html {
        width: 100%;
      }
      body {
        -webkit-text-size-adjust: none;
        -ms-text-size-adjust: none;
        margin: 0;
        padding: 0;
      }
      table {
        border-spacing: 0;
        table-layout: fixed;
        margin: 0 auto;
      }
      table table table {
        table-layout: auto;
      }
      .yshortcuts a {
        border-bottom: none !important;
      }
      img:hover {
        opacity: 0.9 !important;
      }
      a {
        color: #0284c7;
        text-decoration: none;
      }
      .textbutton a {
        font-family: "open sans", arial, sans-serif !important;
      }
      .btn-link a {
        color: #ffffff !important;
      }

      /*Responsive*/
      @media only screen and (max-width: 640px) {
        body {
          margin: 0px;
          width: auto !important;
          font-family: "Open Sans", Arial, Sans-serif !important;
        }
        .table-inner {
          width: 90% !important;
          max-width: 90% !important;
        }
        .table-full {
          width: 100% !important;
          max-width: 100% !important;
          text-align: center !important;
        }
      }

      @media only screen and (max-width: 479px) {
        body {
          width: auto !important;
          font-family: "Open Sans", Arial, Sans-serif !important;
        }
        .table-inner {
          width: 90% !important;
          text-align: center !important;
        }
        .table-full {
          width: 100% !important;
          max-width: 100% !important;
          text-align: center !important;
        }
        /*gmail*/
        u + .body .full {
          width: 100% !important;
          width: 100vw !important;
        }
      }
    </style>
  </head>
  <body class="body">
    <table
      class="full"
      align="center"
      bgcolor="#f3f6fa"
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
    >
      <tr>
        <td align="center">
          <table
            class="table-inner"
            width="500"
            style="max-width: 500px"
            border="0"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <tr>
              <td height="25"></td>
            </tr>
            <!-- logo -->
            <tr>
              <td align="center">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <td align="center" style="line-height: 0px">
                      <img
                        editable
                        lable="logo"
                        style="
                          display: block;
                          line-height: 0px;
                          font-size: 0px;
                          border: 0px;
                        "
                        alt="img"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASoAAAAoCAYAAABJhbeQAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMS0xMFQxMjoxNToxNCswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTEtMTBUMTI6MTc6MzkrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTEtMTBUMTI6MTc6MzkrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmU4Y2M1NTQyLTllNTQtYzg0MS1iYTQ3LTliMGM3MGFkN2MxMSIgeG1wTU06RG9jdW1lbnRJRD0i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"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- end logo -->
            <tr>
              <td height="25"></td>
            </tr>
            <tr>
              <td
                align="center"
                bgcolor="#555555"
                style="
                  border-top-left-radius: 6px;
                  border-top-right-radius: 6px;
                  background-color: rgb(17, 24, 39);
                  border-bottom: 3px solid #0284c7;
                  background-size: cover;
                "
              >
                <table
                  align="center"
                  width="80%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                >
                  <tr>
                    <td height="40"></td>
                  </tr>
                  <!--title-->
                  <tr>
                    <td
                      align="center"
                      style="
                        font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
                        color: #ffffff;
                        font-size: 28px;
                        font-weight: bold;
                      "
                    >
                      <singleline label="title"
                        >${mailBaseParams.title}</singleline
                      >
                    </td>
                  </tr>
                  <!--end title-->
                  <tr>
                    <td align="center">
                      <table
                        width="50"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td
                            height="20"
                            style="border-bottom: 2px solid #0284c7"
                          ></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="15"></td>
                  </tr>
                  <!--content-->
                  <tr>
                    <td
                      align="left"
                      style="
                        font-family: 'Open sans', Arial, sans-serif;
                        color: #ffffff;
                        font-size: 14px;
                        line-height: 28px;
                      "
                    >
                      <multiline label="content">
                      ${mailBaseParams.content}
                      </multiline>
                    </td>
                  </tr>
                  <!--end content-->
                  <tr>
                    <td height="30"></td>
                  </tr>
                  <tr>
                    <td height="40"></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                style="
                  border-bottom-left-radius: 6px;
                  border-bottom-right-radius: 6px;
                "
                bgcolor="#FFFFFF"
                align="center"
              >
                <table
                  align="center"
                  width="90%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                >
                  <tr>
                    <td height="25"></td>
                  </tr>
                  <!--content-->
                  <tr>
                    <td
                      align="center"
                      style="
                        font-family: 'Open sans', Arial, sans-serif;
                        color: #7f8c8d;
                        font-size: 14px;
                        line-height: 28px;
                      "
                    >
                      <multiline label="content"
                        ><strong
                          >DIE NR. 1 PLATTFORM FÜR ON-DEMAND
                          AUTOSERVICES</strong
                        ><br />
                        Wir kümmern uns um Dein Auto als wäre es unser eigenes.
                        Mit CARFULLY hast Du nur einen Ansprechpartner für alle
                        Services – alles aus einer Hand!
                      </multiline>
                    </td>
                  </tr>
                  <!--end content-->
                  <tr>
                    <td height="25"></td>
                  </tr>
                  <!--button-->
                  <tr>
                    <td align="center">
                      <table
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td align="center">
                            <!-- left -->
                            <table
                              class="table-full"
                              width="150"
                              border="0"
                              align="left"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td
                                  height="40"
                                  align="center"
                                  style="
                                    font-family: 'Open sans', Arial, sans-serif;
                                    color: #0284c7;
                                    font-size: 13px;
                                    padding-left: 15px;
                                    padding-right: 15px;
                                    font-weight: normal;
                                    border: 2px solid #0284c7;
                                  "
                                >
                                  <a href="${process.env.SERVER_URL}">
                                    <singleline label="button-1"
                                      >Zur Carfully</singleline
                                    >
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <!-- end left -->
                            <!--[if (gte mso 9)|(IE)]></td><td><![endif]-->
                            <table
                              width="10"
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td height="15"></td>
                              </tr>
                            </table>
                            <!--[if (gte mso 9)|(IE)]></td><td><![endif]-->
                            <!-- right -->
                            <table
                              class="table-full"
                              width="150"
                              border="0"
                              align="right"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td
                                  height="40"
                                  align="center"
                                  style="
                                    font-family: 'Open sans', Arial, sans-serif;
                                    color: #0284c7;
                                    font-size: 13px;
                                    padding-left: 15px;
                                    padding-right: 15px;
                                    font-weight: normal;
                                    border: 2px solid #0284c7;
                                  "
                                >
                                  <a href="${process.env.SERVER_URL}booking">
                                    <singleline label="button-2"
                                      >Jetzt buchen</singleline
                                    >
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <!-- end right -->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!--end button-->
                  <tr>
                    <td height="35"></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td height="25"></td>
            </tr>
            <!-- preference -->
            <tr>
              <td
                align="center"
                class="preference"
                style="
                  font-family: 'Open sans', Arial, sans-serif;
                  color: #95a5a6;
                  font-size: 12px;
                  font-style: italic;
                "
              >
                Folgen Sie uns!
              </td>
            </tr>
            <!-- end preference -->
            <tr>
              <td height="10"></td>
            </tr>
            <tr>
              <td align="center">
                <!--social-->
                <table
                  border="0"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <td align="center" style="line-height: 0px">
                      <a href="#">
                        <img
                          alt="facebook"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA3UlEQVR4nO2UsQrCMBRFz+g3iHXtqoPf4Bf0j9wEQbCruCqFgquLrrr4IVpM6+IgFeEJodi0senmhSyv990TXpPAXz/IAyIgBfKa6+2NAb9O+NUiOC+sRDJKFVmEPYAzsANOwF3qGxOg7lgOQL/Qe5RvygSoE54B3S+9H0DeFLDX/ENgK2NSrgArzT8r8TQCLDX/3CVgAgTASPMPpBa4GNHY0NcBnm0CfBcjyuSmLjT/VGppWz85bPsUhbaA1AHgZgLEDgBrKk5D0gBwAXpUyJMnV1kAlOy8MvwvinoBPgz34ubjSpQAAAAASUVORK5CYII="
                        />
                      </a>
                    </td>
                    <td align="center" style="line-height: 0px">
                      <a href="https://www.instagram.com/carfully.de/">
                        <img
                          alt="instagram"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7ElEQVR4nO2UvwrCMBCHv8nFPw8kSrWrFR9HEDcp6tuIddX2Yazu1j0SuMEhSWPS0R8chLvLfUdyCfwVqBVQAW9AtZjOKYGlb/GDR1Flsdyn85DCY2Ai68wFqAIBE2Aq65sL0FgKnIAE6IvNgLMl9+UCmDasHfkbyx5vwEn8PeAIPIBaBkH7tIoYQOKYLO3TmscABuJ/GGJPiQ27ANSG2F1ioxjAzHFEe4mlMYCz+HsCqQ2XfIkBKBlFm7a/jqntoRUyLQOx1NJ560MrA78K9WVXF2DZAWBBi/KI4js8lcmv2HgUbeRYWjv/C5M+zlP3iDQ02P4AAAAASUVORK5CYII="
                        />
                      </a>
                    </td>
                  </tr>
                </table>
                <!--end social-->
              </td>
            </tr>
            <tr>
              <td height="25"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;
}
