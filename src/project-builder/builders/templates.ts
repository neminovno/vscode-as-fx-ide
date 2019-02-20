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

export function get_appDescriptor_mobile(pm: ProjectModel): string {

    return `<?xml version="1.0" encoding="utf-8" ?>
<application xmlns="http://ns.adobe.com/air/application/${pm.airVersion}">
	<id>${pm.appId}</id>
	<versionNumber>0.0.0</versionNumber>
	<filename>${pm.appName}</filename>
	<name>${pm.appName}</name>
	<initialWindow>
		<content>[Path to content will be replaced by Visual Studio Code]</content>
        <visible>true</visible>
        
        <autoOrients>true</autoOrients>
        <fullScreen>false</fullScreen>
        <softKeyboardBehavior>none</softKeyboardBehavior>
	</initialWindow>

	<icon>
		<image48x48>icons/icon-48.png</image48x48>
    </icon>
    
    
    <!-- iOS specific capabilities -->
	<!-- <iPhone> -->
		<!-- A list of plist key/value pairs to be added to the application Info.plist -->
		<!-- <InfoAdditions>
            <![CDATA[
                <key>UIDeviceFamily</key>
                <array>
                    <string>1</string>
                    <string>2</string>
                </array>
                <key>UIStatusBarStyle</key>
                <string>UIStatusBarStyleBlackOpaque</string>
                <key>UIRequiresPersistentWiFi</key>
                <string>YES</string>
            ]]>
        </InfoAdditions> -->
        <!-- A list of plist key/value pairs to be added to the application Entitlements.plist -->
		<!-- <Entitlements>
            <![CDATA[
                <key>keychain-access-groups</key>
                <array>
                    <string></string>
                    <string></string>
                </array>
            ]]>
        </Entitlements> -->
	<!-- Display Resolution for the app (either "standard" or "high"). Optional. Default "standard" -->
	<!-- <requestedDisplayResolution></requestedDisplayResolution> -->
	<!-- Forcing Render Mode CPU for the devices mentioned. Optional  -->
	<!-- <forceCPURenderModeForDevices></forceCPURenderModeForDevices> -->
	<!-- File containing line separated list of external swf paths. These swfs won't be 
	packaged inside the application and corresponding stripped swfs will be output in 
	externalStrippedSwfs folder. -->
	<!-- <externalSwfs></externalSwfs> -->
	<!-- </iPhone> -->

	<!-- Specify Android specific tags that get passed to AndroidManifest.xml file. -->
    <!--<android> -->
    <!--	<manifestAdditions>
		<![CDATA[
			<manifest android:installLocation="auto">
				<uses-permission android:name="android.permission.INTERNET"/>
				<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
				<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
				<uses-feature android:required="true" android:name="android.hardware.touchscreen.multitouch"/>
				<application android:enabled="true">
					<activity android:excludeFromRecents="false">
						<intent-filter>
							<action android:name="android.intent.action.MAIN"/>
							<category android:name="android.intent.category.LAUNCHER"/>
						</intent-filter>
					</activity>
				</application>
            </manifest>
		]]>
        </manifestAdditions> -->
	    <!-- Color depth for the app (either "32bit" or "16bit"). Optional. Default 16bit before namespace 3.0, 32bit after -->
        <!-- <colorDepth></colorDepth> -->
        <!-- Indicates if the app contains video or not. Necessary for ordering of video planes with graphics plane, especially in Jellybean - if you app does video this must be set to true - valid values are true or false -->
        <!-- <containsVideo></containsVideo> -->
    <!-- </android> -->
	<!-- End of the schema for adding the android specific tags in AndroidManifest.xml file -->

    <android>
        <colorDepth>16bit</colorDepth>
        <manifestAdditions><![CDATA[
			<manifest android:installLocation="auto">
			    <!--See the Adobe AIR documentation for more information about setting Google Android permissions-->
			    <!--Removing the permission android.permission.INTERNET will have the side effect
		of preventing you from debugging your application on your device-->
			    <uses-permission android:name="android.permission.INTERNET"/>
			    <!--<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>-->
			    <!--<uses-permission android:name="android.permission.READ_PHONE_STATE"/>-->
			    <!--<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>-->
			    <!--The DISABLE_KEYGUARD and WAKE_LOCK permissions should be toggled together
		in order to access AIR's SystemIdleMode APIs-->
			    <!--<uses-permission android:name="android.permission.DISABLE_KEYGUARD"/>-->
			    <!--<uses-permission android:name="android.permission.WAKE_LOCK"/>-->
			    <!--<uses-permission android:name="android.permission.CAMERA"/>-->
			    <!--<uses-permission android:name="android.permission.RECORD_AUDIO"/>-->
			    <!--The ACCESS_NETWORK_STATE and ACCESS_WIFI_STATE permissions should be toggled
		together in order to use AIR's NetworkInfo APIs-->
			    <!--<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>-->
			    <!--<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>-->
			</manifest>
			
		]]></manifestAdditions>
    </android>
    <iPhone>
        <InfoAdditions><![CDATA[
			<key>UIDeviceFamily</key>
			<array>
				<string>1</string>
				<string>2</string>
			</array>
		]]></InfoAdditions>
        <requestedDisplayResolution>high</requestedDisplayResolution>
    </iPhone>
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


