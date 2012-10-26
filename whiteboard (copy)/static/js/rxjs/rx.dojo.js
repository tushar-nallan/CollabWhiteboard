// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function(){var a=Rx.Observable.FromDojoEvent=function(b,c,d,e){return Rx.Observable.Create(function(f){var g=function(i){f.OnNext(i);};var h=dojo.connect(b,c,d,g,e);return function(){dojo.disconnect(h);};});};dojo.xhrGetAsObservable=function(b){var c={};for(var d in b) c[d]=b[d];var e=new root.AsyncSubject();c.load=function(f,g){e.OnNext({data:f,ioArg:g});e.OnCompleted();};c.error=function(f,g){e.OnNext({error:f,ioArg:g});e.OnCompleted();};dojo.xhrGet(c);return e;};dojo.xhrPostAsObservable=function(b){var c={};for(var d in b) c[d]=b[d];var e=new root.AsyncSubject();c.load=function(f,g){e.OnNext({data:f,ioArg:g});e.OnCompleted();};c.error=function(f,g){e.OnNext({error:f,ioArg:g});e.OnCompleted();};dojo.xhrPost(c);return e;};dojo.xhrPutAsObservable=function(b){var c={};for(var d in b) c[d]=b[d];var e=new root.AsyncSubject();c.load=function(f,g){e.OnNext({data:f,ioArg:g});e.OnCompleted();};c.error=function(f,g){e.OnNext({error:f,ioArg:g});e.OnCompleted();};dojo.xhrPut(c);return e;};dojo.xhrDeleteAsObservable=function(b){var c={};for(var d in b) c[d]=b[d];var e=new root.AsyncSubject();c.load=function(f,g){e.OnNext({data:f,ioArg:g});e.OnCompleted();};c.error=function(f,g){e.OnNext({error:f,ioArg:g});e.OnCompleted();};dojo.xhrDelete(c);return e;};dojo.Deferred.prototype.asObservable=function(){var b=new Rx.AsyncSubject();this.then(function(c){b.OnNext(c);b.OnCompleted();},function(c){b.OnError(c);});return b;};Rx.AsyncSubject.prototype.AsDeferred=function(){var b=new dojo.Deferred();this.Subscribe(function(c){b.callback(c);},function(c){b.errback(c);});return b;};})();