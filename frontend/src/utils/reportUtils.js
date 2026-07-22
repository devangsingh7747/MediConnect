import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ---------------- PDF Export ---------------- */

export const exportToPDF = (
    title,
    headers,
    data,
    fileName
) => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 18);

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 28,
        styles: {
            fontSize: 10
        },
        headStyles: {
            fillColor: [37, 99, 235]
        }
    });

    doc.save(`${fileName}.pdf`);

};

/* ---------------- Excel Export ---------------- */

export const exportToExcel = (
    data,
    fileName
) => {

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Report"
    );

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    const file = new Blob(
        [excelBuffer],
        {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        }
    );

    saveAs(file, `${fileName}.xlsx`);

};