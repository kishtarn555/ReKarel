import gulp from "gulp"
import fileInclude from "gulp-file-include"
import replace from 'gulp-replace'
import insert  from 'gulp-insert'
import clean  from 'gulp-clean'
import htmlmin from 'gulp-html-minifier-terser'
import rename  from "gulp-rename"
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url);

const manifest = require('./package.json');
const coreManifest = require('./node_modules/@rekarel/core/package.json');
import { exec } from 'child_process';

const mainPath = "html/index.html"
const mainPathDist = "webapp/"

const docs = [
    "html/docs/index.html",
];

const printSubDocs = [
    "html/docs/java/",
    "html/docs/pascal/",
    "html/docs/rekarel/",
];

const subDocs= [    
    ...printSubDocs,
    "html/docs/",
    "html/docs/java_tutorial/",
    "html/docs/pascal_tutorial/",
]

const docsDist = "webapp/docs"
const printDocsDist = "webapp/docs/print"

gulp.task('bundle-html', ()=> {
    return gulp.src([mainPath])
    .pipe(
        fileInclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                shortVersion: manifest.version.replace(/[\.\-]/g,"_"),
                longVersion: manifest.version,
                coreVersion: manifest.dependencies["@rekarel/core"].replace(/^\^/, ""),
                languageVersion: coreManifest.rekarel.language
            }
        }))
    .pipe(htmlmin({
        collapseWhitespace:true,
        removeComments:true
    }))
    .pipe(gulp.dest(mainPathDist))
    
})
// Task to copy images
gulp.task('bundle-images', function () {
    return gulp.src('resources/img/**/*', {encoding:false})
      .pipe(gulp.dest('webapp/img'));
  });
  
  // Task to copy CSS
  gulp.task('bundle-css', function () {
    return gulp.src('resources/css/**/*')
      .pipe(gulp.dest('webapp/css'));
  });
  
  // Task to copy JavaScript
  gulp.task('bundle-js', function () {
    return gulp.src('resources/js/**/*')
      .pipe(gulp.dest('webapp/js'));
  });
  
  // Default task to run all copy tasks
  gulp.task('bundle-resources', gulp.parallel('bundle-images', 'bundle-css', 'bundle-js'));

const useTemplate = (template, contentPath, destPath, outFile, webRoot) => (
    () => {
        const substancePath = Array.isArray(contentPath) ? contentPath : [[contentPath,{}]];
        const substance = substancePath.map(([p,c]) => {
            const header = path.basename(p, path.extname(p));
            return `@@include('${p}', ${JSON.stringify({header ,...c})} )`
        }).join('\n');
        return gulp.src(template, {encoding: false})
            .pipe(fileInclude({
                prefix: "@@",
                basepath: "./",
                
                context: {
                    languageVersion: coreManifest.rekarel.language,
                    substance: substance,
                    webRoot: webRoot
                }
            }))
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(rename(outFile))
            .pipe(gulp.dest(destPath));
    }
);

const bundleDocsTasks = () => {
    const tasks = subDocs.flatMap(subDoc => {
        return fs.readdirSync(subDoc)
            .filter(file => file.endsWith(".html"))
            .map(file => {
                const path = subDoc + file;
                const destPath = docsDist + "/" + subDoc.replace("html/docs/", "");
                const template = "html/docs/prettyBase.template";
                const out = file === 'index.html' ? file: `${file.replace(".html", "")}/index.html` ;
                const bundleOneDoc = useTemplate(template, path, destPath, out, '/docs');
                bundleOneDoc.displayName = `docs:${path}`;

                return bundleOneDoc;
            });
    });

    return gulp.parallel(...tasks);
};



const bundlePrintableDocsTasks = () => {
    const tasks = printSubDocs.map(subDoc => {
        const files =  fs.readdirSync(subDoc)
            .filter(file => file.endsWith(".html") && file !== "index.html");
        const paths = files.map(file => [subDoc + file, {showH1: true}]);
        const destPath = printDocsDist + "/" + subDoc.replace("html/docs/", "");
        const template = "html/docs/print.template";
        const out = "index.html";
        const bundleOneDoc = useTemplate(template, paths, destPath, out, '/docs');
        bundleOneDoc.displayName = `printable:${subDoc}`;

        return bundleOneDoc;
        ;
    });

    return gulp.parallel(...tasks);
};

gulp.task("bundle-docs", bundleDocsTasks());
gulp.task("bundle-printable-docs", bundlePrintableDocsTasks());

gulp.task('clean-docs', ()=> {
    return gulp.src(docsDist, {allowEmpty: true})    
        .pipe(clean());
    
})



gulp.task('process-jison-java', ()=> {

    const path = 'js/kareljava.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction javaParser() {\n    return kareljava.parse.apply(kareljava, arguments);\n}\nexport {kareljava, javaParser }\n'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})


gulp.task('process-jison-pascal', ()=> {

    const path = 'js/karelpascal.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction pascalParser () {\n    return karelpascal.parse.apply(karelpascal, arguments);\n}\nexport {karelpascal, pascalParser}'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})


gulp.task('process-jison-java2pascal', ()=> {

    const path = 'js/java2pascal.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction java2pascalParser () {\n    return java2pascal.parse.apply(java2pascal, arguments);\n}\nexport {java2pascal, java2pascalParser}'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})


gulp.task('process-jison-pascal2java', ()=> {

    const path = 'js/pascal2java.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction pascal2javaParser () {\n    return pascal2java.parse.apply(pascal2java, arguments);\n}\nexport {pascal2java, pascal2javaParser}'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})

const paths = {
    html: [
        './webapp/index.html',
        './webapp/ayuda.html',
        './webapp/ayuda-java.html',
        './webapp/ayuda-pascal.html',
    ],
    js: [
        './webapp/js/cindex.js',
    ],
    img: './webapp/img/*',
    css: './webapp/css/*',
    license: './LICENSE',
    build: './build'
};
gulp.task('clean-webapp', ()=> {
    return gulp.src('./webapp', {allowEmpty: true, read: false})
    .pipe(clean());
})
gulp.task('clean', ()=> {
    return gulp.src(paths.build, {allowEmpty: true, read: false})
    .pipe(clean());
});

gulp.task('copy-html', () => {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.build));
});

gulp.task('copy-js', () => {
    return gulp.src(paths.js)
        .pipe(gulp.dest(`${paths.build}/js`));
});

gulp.task('copy-img', () => {
    return gulp.src(paths.img)
        .pipe(gulp.dest(`${paths.build}/img`));
});

gulp.task('copy-css', () => {
    return gulp.src(paths.css)
        .pipe(gulp.dest(`${paths.build}/css`));
});
gulp.task('copy-license', () => {
    return gulp.src(paths.license)
        .pipe(gulp.dest(`${paths.build}`));
});

gulp.task('default', gulp.series('bundle-html', 'bundle-docs', 'bundle-printable-docs', 'bundle-resources'));
gulp.task('build', gulp.series('clean', 'copy-html', 'copy-js', 'copy-img', 'copy-css','copy-license'));
gulp.task('buildsource', (done) => {
    exec('npm run build:source', (err, stdout, stderr) => {
        if (stdout) process.stdout.write(stdout);
        if (stderr) process.stderr.write(stderr);
        done(err);
    });
});

gulp.task('watch', () => {
    gulp.watch(['html/**/*', 'resources/**/*'], gulp.series('default'));
    gulp.watch(['src/**/*'], gulp.series('buildsource'));
});
