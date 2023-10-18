import { existsSync, readFileSync } from "fs";
import { transformFileSync } from "@babel/core";
import { basename } from "path";

const getRowCode = (filePath: string, [start, end]: [number, number]) => {
  const code = readFileSync(filePath, { encoding: 'utf-8' });
  const codeArr = code.split('\n');
  return Array.from(new Array(end - start + 1).fill(0)).map((_, index) => codeArr[start + index - 1]).join('\n').trimStart();
}

const literalPlugin = (rows: {
  rowNumber: string,
  content: string
  text?: string,
  colNumber: string;
}[], code: string) => () => {
  return {
    name: 'literalPlugin',
    visitor: {
      Literal({ node }: any) {
        if (node.type === 'StringLiteral' && /[\u4e00-\u9fa5]/.test(node.value || '')) {
          const { loc, value } = node;
          const hasExit = rows.find(item => item.rowNumber === loc.start.line && value === item.text);
          if (!hasExit) {
            rows.push({
              content: getRowCode(code, [loc.start.line, loc.end.line]),
              rowNumber: loc.start.line,
              text: value,
              colNumber: loc.start.column
            })
          }
        }

        if (node.type === 'TemplateLiteral') {
          const { quasis = [] } = node;
          quasis.forEach(({ loc, value }: any) => {
            if (/[\u4e00-\u9fa5]/.test(value.raw || '')) {
                rows.push({
                  content: getRowCode(code, [loc.start.line, loc.end.line]),
                  rowNumber: loc.start.line,
                  text: value.raw,
                  colNumber: loc.start.column
                })
            }
          })
        }
      }
    }
  };
}

export const parseFiles = (files: string[]) => {
  const result: {
    fileName: string,
    filePath: string,
    rows: {
      rowNumber: string,
      content: string,
      colNumber: string;
    }[]
  }[] = [];

  files.forEach(filePath => {
    if (existsSync(filePath) && /.(ts|js|tsx|jsx)$/.test(filePath)) {
      const rows: (typeof result)[number]['rows'] = [];
      const plugin = literalPlugin(rows, filePath);
      const fileName = basename(filePath);
        transformFileSync(filePath, {
          filename: fileName,
          plugins: [plugin],
          presets: [require.resolve("@babel/preset-typescript"), [
            require.resolve('@babel/preset-react'),
            {
              "throwIfNamespace": false
            }
          ]]
        });

      if (rows.length > 0) {
        result.push({
          fileName: fileName,
          filePath: filePath,
          rows
        })
      }
    }
  });
  return result;
}