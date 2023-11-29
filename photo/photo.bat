
@Echo off

set dir=%1
set dir=%dir:\=//%

(
    echo var List = [
    for /f "delims=" %%A in ('dir /B %1') do (
        echo {"Url": "%dir%//%%~A"},
    )
    echo ]
) > %~dp0photo.js