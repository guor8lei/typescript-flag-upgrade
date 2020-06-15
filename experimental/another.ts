const project = await createProject({
  tsConfigFilePath: './tsconfig.json',
});

// output all the source files that were added
console.log(project.getSourceFiles().map(s => s.fileName));
