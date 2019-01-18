package br.com.mobilemind.api.pdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.PDPageTree;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.File;
import java.io.IOException;
import java.text.MessageFormat;

public class Main {


    public static void main(String[] args) throws IOException {

        if(args.length != 2)
            throw new RuntimeException("required two params: PDF path origin and destination");

        String filenameSrc= args[0];
        String filenameDest = args[1];

        PDDocument doc = null;
        try {
            File file = new File(filenameSrc);
            doc = PDDocument.load(file);


            PDPageTree pages = doc.getDocumentCatalog().getPages();

            int pageNumber = 1;
            int pagesCount = pages.getCount();

            for (PDPage page : pages) {
                PDPageContentStream contentStream = new PDPageContentStream(doc, page, PDPageContentStream.AppendMode.APPEND, true, true);
                contentStream.beginText();
                contentStream.setFont(PDType1Font.TIMES_ITALIC, 10);

                PDRectangle pageSize = page.getMediaBox();
                float x = pageSize.getLowerLeftX();
                float y = pageSize.getLowerLeftY();
                contentStream.newLineAtOffset(x+ pageSize.getWidth()-100, y+18);

                //footercontentStream.moveTextPositionByAmount((PDPage.PAGE_SIZE_A4.getUpperRightX() / 2), (PDPage.PAGE_SIZE_A4.getLowerLeftY()));

                String text = MessageFormat.format("Página {0} de {1}",pageNumber++, pagesCount);

                contentStream.showText(text);
                contentStream.endText();
                contentStream.close();
            }
            doc.save(filenameDest);
        } finally {
            if (doc != null) {
                doc.close();
            }
        }

    }
}
