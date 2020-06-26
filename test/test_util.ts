import {Node, ts, SourceFile} from 'ts-morph';

export function compareSourceFiles(given: SourceFile, expected: SourceFile) {
  const diffs: string[] = [];

  const traverseSourceFile = (
    givenNode: Node<ts.Node>,
    expectedNode: Node<ts.Node>
  ) => {
    if (givenNode.getText() !== expectedNode.getText()) {
      diffs.push(
        'Given: ' +
          givenNode.getText() +
          ', Expected: ' +
          expectedNode.getText()
      );
      return;
    }

    const givenNodeChildren = givenNode.getChildren();
    const expectedNodeChildren = expectedNode.getChildren();

    if (givenNodeChildren.length !== givenNodeChildren.length) {
      diffs.push(
        'Given node # children: ' +
          givenNodeChildren.length +
          ', Expected node # children: ' +
          expectedNodeChildren.length
      );
    }

    for (let i = 0; i < givenNodeChildren.length; i++) {
      traverseSourceFile(givenNodeChildren[i], expectedNodeChildren[i]);
    }
  };

  traverseSourceFile(given, expected);
  return diffs;
}
