import {Project, ts, Node} from 'ts-morph';

const fixNoImplicitReturns = async (): Promise<void> => {
  const project = new Project({
    tsConfigFilePath: './test/experimental/tsconfig.json',
  });

  const sourceFiles = project.getSourceFiles();
  // console.log(
  //   sourceFiles.map(file => {
  //     return file.getFilePath();
  //   })
  // );

  for (const sourceFile of sourceFiles) {
    const sourceFileDiagnostics = sourceFile.getPreEmitDiagnostics();
    console.log(sourceFileDiagnostics);

    const diagnosticPos = new Set();
    sourceFileDiagnostics.forEach(diagnostic => {
      diagnosticPos.add(diagnostic.getStart());
    });
    // console.log(diagnosticPos);

    const errors: Node<ts.Node>[] = [];
    sourceFile.forEachDescendant(node => {
      if (diagnosticPos.has(node.getStart())) {
        errors.push(node);
      }
    });
    // console.log(errors);

    for (let i = errors.length - 1; i >= 0; i--) {
      const currError = errors[i];
      const parent = currError.getParent();
      if (
        Node.isIdentifier(currError) &&
        parent &&
        Node.isFunctionDeclaration(parent)
      ) {
        parent.addStatements(
          '// typescript-flag-upgrade automated fix: --noImplicitReturns'
        );
        parent.addStatements('return undefined;');
      } else if (
        Node.isReturnStatement(currError) &&
        parent &&
        Node.isBlock(parent)
      ) {
        const childIndex = currError.getChildIndex();
        parent.removeStatement(childIndex);
        parent.addStatements(
          '// typescript-flag-upgrade automated fix: --noImplicitReturns'
        );
        parent.addStatements('return undefined;');
      }
    }

    const printer = ts.createPrinter({removeComments: false});
    console.log(printer.printFile(sourceFile.compilerNode));
  }

  // when you're all done, call this and it will save everything to the file system
  await project.save();
};

// fixNoImplicitReturns();

const fixStrictNullChecks = async (): Promise<void> => {
  const project = new Project({
    tsConfigFilePath: './test/experimental/tsconfig.json',
  });

  const sourceFiles = project.getSourceFiles();
  // console.log(
  //   sourceFiles.map(file => {
  //     return file.getFilePath();
  //   })
  // );

  for (const sourceFile of sourceFiles) {
    const sourceFileDiagnostics = sourceFile.getPreEmitDiagnostics();
    // console.log(sourceFileDiagnostics);

    const diagnosticPos = new Set();
    sourceFileDiagnostics.forEach(diagnostic => {
      diagnosticPos.add(diagnostic.getStart());
    });
    // console.log(diagnosticPos);

    const errors: Node<ts.Node>[] = [];
    sourceFile.forEachDescendant(node => {
      if (diagnosticPos.has(node.getStart())) {
        errors.push(node);
      }
    });
    // console.log(errors);

    for (let i = errors.length - 1; i >= 0; i--) {
      const currError = errors[i];
      const parent = currError.getParent();
      if (
        Node.isIdentifier(currError) &&
        Node.isPropertyAccessExpression(parent!)
      ) {
        currError.replaceWithText(currError.getText() + '!');
      }
    }

    const printer = ts.createPrinter({removeComments: false});
    console.log(printer.printFile(sourceFile.compilerNode));
  }

  // when you're all done, call this and it will save everything to the file system
  // await project.save();

  // currError.findReferences().forEach(referenceNode => {
  //   referenceNode.getReferences().forEach(referenceEntry => {
  //     console.log(referenceEntry.getNode());
  //   });
  // });
  // return;
};

fixStrictNullChecks();

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
