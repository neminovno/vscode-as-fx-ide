import { ProjectModel } from "../model/ProjectModel";
import { PackageType } from "../types";

export function get_asconfig_desktop(pm: ProjectModel): string {

    return `{
    "config": "air",
    "compilerOptions": {
        "output": "bin/${pm.appName}.swf"
        //"external-library-path": ["path/to/native_extensions"] //use for ANE
    },
    "application": "${pm.get_srcDir()}${pm.appName}-app.xml",
    "files": [
        "${pm.get_srcDir()}${pm.appName}${pm.extension}"
    ],

    /* Packaging Setup: */

    "airOptions": {

        // package as Shared runtime
        ${pm.packageType === PackageType.SHARED ? '' : '//'}"output": "bin/${pm.appName}.air",

        // package as Captive runtime
        ${pm.packageType === PackageType.BUNDLED ? '' : '//'}"target": "bundle",
        ${pm.packageType === PackageType.BUNDLED ? '' : '//'}"output": "bin/${pm.appName}-BundleFolder",

        // package as Native installer
        ${pm.packageType === PackageType.NATIVE_INSTALLER ? '' : '//'}"target": "native",
        ${pm.packageType === PackageType.NATIVE_INSTALLER ? '' : '//'}"output": "bin/${pm.appName}-Installer.exe",

        //"extdir": ["path/to/native_extensions"] //use for ANE

        // packaging settings per OS
        //"windows": { // move packaging options here for Windows OS },
        //"mac": { // move packaging options here for Mac OS },
        
        "signingOptions": {
            "storetype": "pkcs12",
            "keystore": "C:\\\\dev\\\\cert\\\\my-selfsigned-2048-RSA-cert.p12", // We'll be asked for the password during packaging proccess
            "tsa": "http://timestamp.digicert.com" // custom timestamp server
        },
        "files": [
            {
                "file": "icons",
                "path": "icons"
            }
        ]
    }
}`;
}

export function get_asconfig_mobile(pm: ProjectModel): string {

    return `{
    "config": "airmobile",
    "compilerOptions": {
        "output": "bin/${pm.appName}.swf"
        //"external-library-path": ["path/to/native_extensions"] //use for ANE
    },
    "application": "${pm.get_srcDir()}${pm.appName}-app.xml",
    
    "files": [
        "${pm.get_srcDir()}${pm.appName}${pm.extension}"
    ]

    
    /* packaging options below */
    ,
    "airOptions": {
        "android": {
            //"target": "", //apk-captive-runtime|apk|apk-debug|apk-profile
            "output": "bin/${pm.appName}.apk",
            "signingOptions": {
                "storetype": "pkcs12",
                "keystore": "android_certificate.p12" // We'll be asked for the password during packaging proccess
            }
            //"extdir": ["path/to/native_extensions"] //use for ANE
        },
        "ios": {
            //"target": "ipa", // ipa-app-store|ipa-ad-hoc|ipa-debug|ipa-test|ipa-debug-interpreter|ipa-test-interpreter
            "output": "bin/${pm.appName}.ipa",
            "signingOptions": {
                "storetype": "pkcs12",
                "keystore": "ios_certificate.p12", // We'll be asked for the password during packaging proccess
                "provisioning-profile": "example.mobileprovision"
            }
            //"extdir": ["path/to/native_extensions"] //use for ANE
        }

        /* we may have some files (and folders) to add to the package, including icons and other assets */
        ,
        "files": [
            {
                "file": "icons",
                "path": "icons"
            }
        ]
    }
}`;
}

export function get_asconfig_lib(pm: ProjectModel): string {

    return `{
    "type": "lib",
    //"config": "air", // or airmobile
    "compilerOptions": {
        "source-path": [
            "src"
        ],
        "include-sources": [
            "src"
        ],
        "output": "bin/${pm.appName}.swc"
        
        /*
        "include-classes": [
            "com.example.SomeClass",
            "com.example.utils.AnotherClass"
        ]*/
        
        /*
        "include-namespaces": [
            "http://ns.example.com",
            "library://example.com/library"
        ]*/
    }
}`;
}

export function get_appDescriptor(pm: ProjectModel): string {

    //name can have some hcars like _ in name: AAA_BB
    //id can not
    //const re:RegExp = new RegExp('_','gi');
    //let appId:string = pm.appName.replace('_','');
    //let appId:string = pm.appName.replace(/_/gi,'');
    //let appId:string = pm.getAppId();// .appName.replace(/_/gi,'');

    return `<?xml version="1.0" encoding="utf-8" ?>
<application xmlns="http://ns.adobe.com/air/application/${pm.airVersion}">
	<id>${pm.appId}</id>
	<versionNumber>0.0.0</versionNumber>
	<filename>${pm.appName}</filename>
	<name>${pm.appName}</name>
	<initialWindow>
		<content>[Path to content will be replaced by Visual Studio Code]</content>
		<visible>true</visible>
	</initialWindow>

	<icon>
		<image48x48>icons/icon-48.png</image48x48>
	</icon>
</application>`;
}

export function get_MainAppFile_flex(pm: ProjectModel): string {

    let desktopPrefix = pm.isDesktop() ? 'Windowed' : '';

    return `<?xml version="1.0" encoding="utf-8"?>
<s:${desktopPrefix}Application xmlns:fx="http://ns.adobe.com/mxml/2009"
   xmlns:s="library://ns.adobe.com/flex/spark"
   xmlns:mx="library://ns.adobe.com/flex/mx"
   applicationComplete="onAppComplete()">

	<!-- 
		Guide:
		- check AIR version in Main-app.xml
		- check asconfig.json settings
		- to build: press Ctrl+Shift+B (or Tasks -> Run Build Task)
		- to build and debug: press F5 (or Debug -> Start debugging)
		- to package app: press Alt+T R (or Tasks -> Run Task) and select package task
	-->

    <fx:Declarations></fx:Declarations>
    
	<fx:Script>
		<![CDATA[

			private function onAppComplete():void
			{
				//code here
			}

		]]>
	</fx:Script>

	<s:Label id="label" text="Hello world"/>
	
</s:${desktopPrefix}Application>`;
}

export function get_MainAppFile_as(pm: ProjectModel): string {

    return `package
{
	import flash.display.Sprite;
	import flash.text.TextField;

	public class ${pm.appName} extends Sprite
	{
        /*
		Guide:
		- check AIR version in Main-app.xml
		- check asconfig.json settings
		- to build: press Ctrl+Shift+B (or Tasks -> Run Build Task)
		- to build and debug: press F5 (or Debug -> Start debugging)
		- to package app: press Alt+T R (or Tasks -> Run Task) and select package task
	    */

		public function ${pm.appName}()
		{
			var tf:TextField = new TextField();
			tf.text = "Hello World";
			addChild(tf);
		}
	}
}`;
}

export function get_lib_samplefile(): string {

    return `<?xml version="1.0" encoding="utf-8"?>
<s:Group xmlns:fx="http://ns.adobe.com/mxml/2009" 
            xmlns:s="library://ns.adobe.com/flex/spark" 
            xmlns:mx="library://ns.adobe.com/flex/mx" width="400" height="300">
    
    <!-- 
        Guide:
        - check asconfig.json settings
        - to build: press Ctrl+Shift+B (or Tasks -> Run Build Task)
    -->

</s:Group>`;
}


