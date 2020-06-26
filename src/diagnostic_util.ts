import {Diagnostic, ts, SyntaxKind, SourceFile} from 'ts-morph';
import {NodeDiagnosticList} from './types';

export class DiagnosticUtil {
  /**
   * Filters a list of diagnostics for errors relevant to specific flag.
   * @param {Diagnostic<ts.Diagnostic>[]} diagnostics - List of diagnostics
   * @return {Diagnostic<ts.Diagnostic>[]} List of diagnostics with relevant error codes
   */
  filterDiagnostics(
    diagnostics: Diagnostic<ts.Diagnostic>[],
    diagnosticCodes: Set<number>
  ): Diagnostic<ts.Diagnostic>[] {
    return diagnostics.filter(diagnostic => {
      return diagnosticCodes.has(diagnostic.getCode());
    });
  }

  /**
   * Checks if a list of diagnostics contains relevant codes.
   * @param {Diagnostic<ts.Diagnostic>[]} diagnostics - List of diagnostics
   * @return {boolean} true if diagnostics contain relevant codes
   */
  detectErrors(
    diagnostics: Diagnostic<ts.Diagnostic>[],
    diagnosticCodes: Set<number>
  ): boolean {
    return this.filterDiagnostics(diagnostics, diagnosticCodes).length !== 0;
  }

  /**
   * Retrieves the list of nodes corresponding to a list of diagnostics.
   * @param {Diagnostic<ts.Diagnostic>[]} diagnostics - List of diagnostics
   * @param {Set<number>} diagnosticCodes - Set of relevant codes to filter diagnostics for
   * @param {Set<SyntaxKind>} nodeKinds - Set of node kinds to filter nodes for
   * @return {NodeDiagnosticList} List of corresponding [node, diagnostic] tuples
   */
  filterNodesFromDiagnostics(
    diagnostics: Diagnostic<ts.Diagnostic>[],
    diagnosticCodes: Set<number>,
    nodeKinds: Set<SyntaxKind>
  ): NodeDiagnosticList {
    // Remove all irrelevant diagnostics that don't contain the error codes
    diagnostics = this.filterDiagnostics(diagnostics, diagnosticCodes);

    // Construct map of source file to list of contained diagnostics
    const sourceFileToDiagnostics = new Map<
      SourceFile,
      Diagnostic<ts.Diagnostic>[]
    >();
    diagnostics.forEach(diagnostic => {
      const sourceFile = diagnostic.getSourceFile();

      if (sourceFile) {
        if (sourceFileToDiagnostics.has(sourceFile)) {
          sourceFileToDiagnostics.get(sourceFile)!.push(diagnostic);
        } else {
          sourceFileToDiagnostics.set(sourceFile, [diagnostic]);
        }
      }
    });

    // Traverse each source file AST, constructing list of matching nodes to diagnostics
    const errorNodes: NodeDiagnosticList = [];

    for (const sourceFile of sourceFileToDiagnostics.keys()) {
      sourceFile.forEachDescendant(node => {
        if (nodeKinds.has(node.getKind())) {
          sourceFileToDiagnostics.get(sourceFile)!.forEach(diagnostic => {
            if (diagnostic.getStart() === node.getStart()) {
              errorNodes.push([node, diagnostic]);
            }
          });
        }
      });
    }
    return errorNodes;
  }
}
