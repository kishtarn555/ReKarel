import gulp from "gulp"
import fileInclude from "gulp-file-include"
import replace from 'gulp-replace'
import insert  from 'gulp-insert'
import clean  from 'gulp-clean'

const mainPath = "webapp/html/index.html"
const pascalPath = "webapp/html/docs/pascal/ayuda-pascal.html"
const javaPath = "webapp/html/docs/java/ayuda-java.html"
const mainPathDist = "webapp/"

gulp.task('bundle-html', ()=> {
    return gulp.src([mainPath])
    .pipe(
        fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
    .pipe(gulp.dest(mainPathDist))
    
})


gulp.task('bundle-pascal', ()=> {
    return gulp.src([pascalPath])
    .pipe(
        fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
    .pipe(gulp.dest(mainPathDist))
    
})


gulp.task('bundle-java', ()=> {
    return gulp.src([javaPath])
    .pipe(
        fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
    .pipe(gulp.dest(mainPathDist))
    
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

 gulp.task('default', gulp.series('bundle-html', 'bundle-pascal', 'bundle-java'));
 gulp.task('build', gulp.series('clean', 'copy-html', 'copy-js', 'copy-img', 'copy-css','copy-license'));
