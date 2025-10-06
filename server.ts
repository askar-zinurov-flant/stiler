import * as Stimulsoft from 'stimulsoft-reports-js';
import url from "url";

const loadReport = (path: string): Stimulsoft.Report.StiReport => {
  const stiReport = new Stimulsoft.Report.StiReport();
  stiReport.loadDocumentFile(path);
  return stiReport;
}

Bun.serve({
  port: process.env.PORT,
  development: !!process.env.DEVELOPMENT,
  routes: {
    "/": async () => {
      const stiReport = loadReport("reports/simple-list.json");
      await stiReport.renderAsync2();
      const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Html);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.ImageSvg);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Excel);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Word);
      // const html = stiReport.exportDocument(Stimulsoft.Report.StiExportFormat.Pdf);
      return new Response(html, {
        headers: {
          "Content-Type": "text/html"
          // "Content-Type": "svg+xml"
          // "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          // "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          // "Content-Type": "application/pdf"
        }
      });
    },

    '/reports/*': {
      POST: async (req) => {
        const data = await req.json();
        let reportPath = url.parse(req.url).pathname;

        if (!reportPath) {
          return new Response("Report missing", {
            status: 400,
            headers: { "Content-Type": "text/plain" },
          });
        }

        reportPath = reportPath.replace("/reports/", "");
        reportPath = "reports/" + reportPath + ".json";
        const stiReport = loadReport(reportPath);

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
