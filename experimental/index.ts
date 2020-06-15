import {Project, SourceFile, ts, Node, StatementedNode} from 'ts-morph';

const main = async (): Promise<void> => {
  const project = new Project({
    tsConfigFilePath: './tsconfig.json',
  });

  const sourceFiles = project.getSourceFiles();
  // console.log(
  //   sourceFiles.map(file => {
  //     return file.getFilePath();
  //   })
  // );

  const sourceFile = project.getSourceFile('test.ts');
  const sourceFileDiagnostics = sourceFile.getPreEmitDiagnostics();
  // console.log(sourceFileDiagnostics);

  const diagnosticPos = new Set();
  sourceFileDiagnostics.forEach(diagnostic => {
    diagnosticPos.add(diagnostic.getStart());
  });
  // console.log(diagnosticPos);

  const errors = [];
  sourceFile.forEachDescendant(node => {
    if (diagnosticPos.has(node.getStart())) {
      errors.push(node);
    }
  });
  // console.log(errors);

  for (var i = errors.length - 1; i >= 0; i--) {
    let currError = errors[i];
    if (Node.isIdentifier(currError)) {
      const parent = currError.getParent();
      if (Node.isFunctionDeclaration(parent)) {
        parent.addStatements('// FIX GOES HERE');
        parent.addStatements('return undefined;');
      }
    } else if (Node.isReturnStatement(currError)) {
      const parent = currError.getParent();
      if (Node.isBlock(parent)) {
        const childIndex = currError.getChildIndex();
        parent.removeStatement(childIndex);
        parent.addStatements('// FIX GOES HERE');
        parent.addStatements('return undefined;');
      }
    }
  }

  const printer = ts.createPrinter({removeComments: false});
  console.log(printer.printFile(sourceFile.compilerNode));

  // when you're all done, call this and it will save everything to the file system
  await project.save();
};

main();

// const file = ts.createSourceFile(
//   'test.ts',
//   `function myFunc(a: number, b: number): number {
//     return a + b;
// }`,
//   ts.ScriptTarget.Latest,
//   true
// );
// const functionDec = file.statements.find(ts.isFunctionDeclaration)!;

// console.log(functionDec);

// ts.addSyntheticLeadingComment(
//   functionDec,
//   ts.SyntaxKind.MultiLineCommentTrivia,
//   'My long desired comment',
//   true
// );

// const printer = ts.createPrinter({removeComments: false});
// console.log(printer.printFile(file));

// ts.addSyntheticLeadingComment(
//   visited[0],
//   ts.SyntaxKind.MultiLineCommentTrivia,
//   'My long desired comment',
//   true
// );

// const printer = ts.createPrinter({removeComments: false});
// console.log(printer.printFile(sourceFile.compilerNode));
