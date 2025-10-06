import * as Stimulsoft from 'stimulsoft-reports-js';
import report from "./reports/SimpleList.js";

Bun.serve({
  port: process.env.PORT,
  development: !!process.env.DEVELOPMENT,
  routes: {
    "/": async () => {
      const stiReport = new Stimulsoft.Report.StiReport();
      stiReport.loadDocument(report);
      await stiReport.renderAsync2();
      const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Html);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.ImageSvg);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Excel);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Word);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Pdf);
      return new Response(html, {
        headers: {
          "Content-Type": "text/html", // "Content-Type": "svg+xml",
          // "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          // "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          // "Content-Type": "application/pdf"
        }
      });
    },

    '/render': {
      POST: async (req) => {
        const data = await req.json();
        const stiReport = new Stimulsoft.Report.StiReport();
        stiReport.loadFile("reports/SimpleList.mrt");

        stiReport.dictionary.databases.clear();
        const dataSet = new Stimulsoft.System.Data.DataSet("Demo");
        dataSet.readJson(data);
        stiReport.regData("Demo", "Demo", dataSet);
        await stiReport.renderAsync2();
        const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Pdf);

        return new Response(html, {
          headers: {
            "Content-Type": "application/pdf"
          }
        });
      }
    }
  }
})
