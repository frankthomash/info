//
// Autogenerated by Thrift Compiler (0.22.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;
var Int64 = require('node-int64');


var ttypes = require('./IClientRPCService_types');
//HELPER FUNCTIONS AND STRUCTURES

var IClientRPCService_openSession_args = function(args) {
  this.req = null;
  if (args) {
    if (args.req !== undefined && args.req !== null) {
      this.req = new ttypes.TSOpenSessionReq(args.req);
    }
  }
};
IClientRPCService_openSession_args.prototype = {};
IClientRPCService_openSession_args.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.req = new ttypes.TSOpenSessionReq();
        this.req[Symbol.for("read")](input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_openSession_args.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_openSession_args');
  if (this.req !== null && this.req !== undefined) {
    output.writeFieldBegin('req', Thrift.Type.STRUCT, 1);
    this.req[Symbol.for("write")](output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_openSession_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = new ttypes.TSOpenSessionResp(args.success);
    }
  }
};
IClientRPCService_openSession_result.prototype = {};
IClientRPCService_openSession_result.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.TSOpenSessionResp();
        this.success[Symbol.for("read")](input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_openSession_result.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_openSession_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success[Symbol.for("write")](output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_closeSession_args = function(args) {
  this.req = null;
  if (args) {
    if (args.req !== undefined && args.req !== null) {
      this.req = new ttypes.TSCloseSessionReq(args.req);
    }
  }
};
IClientRPCService_closeSession_args.prototype = {};
IClientRPCService_closeSession_args.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.req = new ttypes.TSCloseSessionReq();
        this.req[Symbol.for("read")](input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_closeSession_args.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_closeSession_args');
  if (this.req !== null && this.req !== undefined) {
    output.writeFieldBegin('req', Thrift.Type.STRUCT, 1);
    this.req[Symbol.for("write")](output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_closeSession_result = function(args) {
};
IClientRPCService_closeSession_result.prototype = {};
IClientRPCService_closeSession_result.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_closeSession_result.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_closeSession_result');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_executeQueryStatement_args = function(args) {
  this.req = null;
  if (args) {
    if (args.req !== undefined && args.req !== null) {
      this.req = new ttypes.TSExecuteStatementReq(args.req);
    }
  }
};
IClientRPCService_executeQueryStatement_args.prototype = {};
IClientRPCService_executeQueryStatement_args.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.req = new ttypes.TSExecuteStatementReq();
        this.req[Symbol.for("read")](input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_executeQueryStatement_args.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_executeQueryStatement_args');
  if (this.req !== null && this.req !== undefined) {
    output.writeFieldBegin('req', Thrift.Type.STRUCT, 1);
    this.req[Symbol.for("write")](output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_executeQueryStatement_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = new ttypes.TSExecuteStatementResp(args.success);
    }
  }
};
IClientRPCService_executeQueryStatement_result.prototype = {};
IClientRPCService_executeQueryStatement_result.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.TSExecuteStatementResp();
        this.success[Symbol.for("read")](input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_executeQueryStatement_result.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_executeQueryStatement_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success[Symbol.for("write")](output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_requestStatementId_args = function(args) {
  this.sessionId = null;
  if (args) {
    if (args.sessionId !== undefined && args.sessionId !== null) {
      this.sessionId = args.sessionId;
    }
  }
};
IClientRPCService_requestStatementId_args.prototype = {};
IClientRPCService_requestStatementId_args.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I64) {
        this.sessionId = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_requestStatementId_args.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_requestStatementId_args');
  if (this.sessionId !== null && this.sessionId !== undefined) {
    output.writeFieldBegin('sessionId', Thrift.Type.I64, 1);
    output.writeI64(this.sessionId);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_requestStatementId_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = args.success;
    }
  }
};
IClientRPCService_requestStatementId_result.prototype = {};
IClientRPCService_requestStatementId_result.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 0:
      if (ftype == Thrift.Type.I64) {
        this.success = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_requestStatementId_result.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_requestStatementId_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.I64, 0);
    output.writeI64(this.success);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_insertRecord_args = function(args) {
  this.req = null;
  if (args) {
    if (args.req !== undefined && args.req !== null) {
      this.req = new ttypes.TSInsertRecordReq(args.req);
    }
  }
};
IClientRPCService_insertRecord_args.prototype = {};
IClientRPCService_insertRecord_args.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.req = new ttypes.TSInsertRecordReq();
        this.req[Symbol.for("read")](input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_insertRecord_args.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_insertRecord_args');
  if (this.req !== null && this.req !== undefined) {
    output.writeFieldBegin('req', Thrift.Type.STRUCT, 1);
    this.req[Symbol.for("write")](output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCService_insertRecord_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = args.success;
    }
  }
};
IClientRPCService_insertRecord_result.prototype = {};
IClientRPCService_insertRecord_result.prototype[Symbol.for("read")] = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 0:
      if (ftype == Thrift.Type.I32) {
        this.success = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

IClientRPCService_insertRecord_result.prototype[Symbol.for("write")] = function(output) {
  output.writeStructBegin('IClientRPCService_insertRecord_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.I32, 0);
    output.writeI32(this.success);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var IClientRPCServiceClient = exports.Client = function(output, pClass) {
  this.output = output;
  this.pClass = pClass;
  this._seqid = 0;
  this._reqs = {};
};
IClientRPCServiceClient.prototype = {};
IClientRPCServiceClient.prototype.seqid = function() { return this._seqid; };
IClientRPCServiceClient.prototype.new_seqid = function() { return this._seqid += 1; };

IClientRPCServiceClient.prototype.openSession = function(req, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_openSession(req);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_openSession(req);
  }
};

IClientRPCServiceClient.prototype.send_openSession = function(req) {
  var output = new this.pClass(this.output);
  var params = {
    req: req
  };
  var args = new IClientRPCService_openSession_args(params);
  try {
    output.writeMessageBegin('openSession', Thrift.MessageType.CALL, this.seqid());
    args[Symbol.for("write")](output);
    output.writeMessageEnd();
    return this.output.flush();
  }
  catch (e) {
    delete this._reqs[this.seqid()];
    if (typeof output.reset === 'function') {
      output.reset();
    }
    throw e;
  }
};

IClientRPCServiceClient.prototype.recv_openSession = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x[Symbol.for("read")](input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new IClientRPCService_openSession_result();
  result[Symbol.for("read")](input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('openSession failed: unknown result');
};

IClientRPCServiceClient.prototype.closeSession = function(req, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_closeSession(req);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_closeSession(req);
  }
};

IClientRPCServiceClient.prototype.send_closeSession = function(req) {
  var output = new this.pClass(this.output);
  var params = {
    req: req
  };
  var args = new IClientRPCService_closeSession_args(params);
  try {
    output.writeMessageBegin('closeSession', Thrift.MessageType.CALL, this.seqid());
    args[Symbol.for("write")](output);
    output.writeMessageEnd();
    return this.output.flush();
  }
  catch (e) {
    delete this._reqs[this.seqid()];
    if (typeof output.reset === 'function') {
      output.reset();
    }
    throw e;
  }
};

IClientRPCServiceClient.prototype.recv_closeSession = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x[Symbol.for("read")](input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new IClientRPCService_closeSession_result();
  result[Symbol.for("read")](input);
  input.readMessageEnd();

  callback(null);
};

IClientRPCServiceClient.prototype.executeQueryStatement = function(req, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_executeQueryStatement(req);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_executeQueryStatement(req);
  }
};

IClientRPCServiceClient.prototype.send_executeQueryStatement = function(req) {
  var output = new this.pClass(this.output);
  var params = {
    req: req
  };
  var args = new IClientRPCService_executeQueryStatement_args(params);
  try {
    output.writeMessageBegin('executeQueryStatement', Thrift.MessageType.CALL, this.seqid());
    args[Symbol.for("write")](output);
    output.writeMessageEnd();
    return this.output.flush();
  }
  catch (e) {
    delete this._reqs[this.seqid()];
    if (typeof output.reset === 'function') {
      output.reset();
    }
    throw e;
  }
};

IClientRPCServiceClient.prototype.recv_executeQueryStatement = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x[Symbol.for("read")](input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new IClientRPCService_executeQueryStatement_result();
  result[Symbol.for("read")](input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('executeQueryStatement failed: unknown result');
};

IClientRPCServiceClient.prototype.requestStatementId = function(sessionId, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_requestStatementId(sessionId);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_requestStatementId(sessionId);
  }
};

IClientRPCServiceClient.prototype.send_requestStatementId = function(sessionId) {
  var output = new this.pClass(this.output);
  var params = {
    sessionId: sessionId
  };
  var args = new IClientRPCService_requestStatementId_args(params);
  try {
    output.writeMessageBegin('requestStatementId', Thrift.MessageType.CALL, this.seqid());
    args[Symbol.for("write")](output);
    output.writeMessageEnd();
    return this.output.flush();
  }
  catch (e) {
    delete this._reqs[this.seqid()];
    if (typeof output.reset === 'function') {
      output.reset();
    }
    throw e;
  }
};

IClientRPCServiceClient.prototype.recv_requestStatementId = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x[Symbol.for("read")](input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new IClientRPCService_requestStatementId_result();
  result[Symbol.for("read")](input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('requestStatementId failed: unknown result');
};

IClientRPCServiceClient.prototype.insertRecord = function(req, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_insertRecord(req);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_insertRecord(req);
  }
};

IClientRPCServiceClient.prototype.send_insertRecord = function(req) {
  var output = new this.pClass(this.output);
  var params = {
    req: req
  };
  var args = new IClientRPCService_insertRecord_args(params);
  try {
    output.writeMessageBegin('insertRecord', Thrift.MessageType.CALL, this.seqid());
    args[Symbol.for("write")](output);
    output.writeMessageEnd();
    return this.output.flush();
  }
  catch (e) {
    delete this._reqs[this.seqid()];
    if (typeof output.reset === 'function') {
      output.reset();
    }
    throw e;
  }
};

IClientRPCServiceClient.prototype.recv_insertRecord = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x[Symbol.for("read")](input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new IClientRPCService_insertRecord_result();
  result[Symbol.for("read")](input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('insertRecord failed: unknown result');
};
var IClientRPCServiceProcessor = exports.Processor = function(handler) {
  this._handler = handler;
};
IClientRPCServiceProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x[Symbol.for("write")](output);
    output.writeMessageEnd();
    output.flush();
  }
};
IClientRPCServiceProcessor.prototype.process_openSession = function(seqid, input, output) {
  var args = new IClientRPCService_openSession_args();
  args[Symbol.for("read")](input);
  input.readMessageEnd();
  if (this._handler.openSession.length === 1) {
    Q.fcall(this._handler.openSession.bind(this._handler),
      args.req
    ).then(function(result) {
      var result_obj = new IClientRPCService_openSession_result({success: result});
      output.writeMessageBegin("openSession", Thrift.MessageType.REPLY, seqid);
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    }).catch(function (err) {
      var result;
      result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
      output.writeMessageBegin("openSession", Thrift.MessageType.EXCEPTION, seqid);
      result[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  } else {
    this._handler.openSession(args.req, function (err, result) {
      var result_obj;
      if ((err === null || typeof err === 'undefined')) {
        result_obj = new IClientRPCService_openSession_result((err !== null || typeof err === 'undefined') ? err : {success: result});
        output.writeMessageBegin("openSession", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("openSession", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};
IClientRPCServiceProcessor.prototype.process_closeSession = function(seqid, input, output) {
  var args = new IClientRPCService_closeSession_args();
  args[Symbol.for("read")](input);
  input.readMessageEnd();
  if (this._handler.closeSession.length === 1) {
    Q.fcall(this._handler.closeSession.bind(this._handler),
      args.req
    ).then(function(result) {
      var result_obj = new IClientRPCService_closeSession_result({success: result});
      output.writeMessageBegin("closeSession", Thrift.MessageType.REPLY, seqid);
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    }).catch(function (err) {
      var result;
      result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
      output.writeMessageBegin("closeSession", Thrift.MessageType.EXCEPTION, seqid);
      result[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  } else {
    this._handler.closeSession(args.req, function (err, result) {
      var result_obj;
      if ((err === null || typeof err === 'undefined')) {
        result_obj = new IClientRPCService_closeSession_result((err !== null || typeof err === 'undefined') ? err : {success: result});
        output.writeMessageBegin("closeSession", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("closeSession", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};
IClientRPCServiceProcessor.prototype.process_executeQueryStatement = function(seqid, input, output) {
  var args = new IClientRPCService_executeQueryStatement_args();
  args[Symbol.for("read")](input);
  input.readMessageEnd();
  if (this._handler.executeQueryStatement.length === 1) {
    Q.fcall(this._handler.executeQueryStatement.bind(this._handler),
      args.req
    ).then(function(result) {
      var result_obj = new IClientRPCService_executeQueryStatement_result({success: result});
      output.writeMessageBegin("executeQueryStatement", Thrift.MessageType.REPLY, seqid);
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    }).catch(function (err) {
      var result;
      result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
      output.writeMessageBegin("executeQueryStatement", Thrift.MessageType.EXCEPTION, seqid);
      result[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  } else {
    this._handler.executeQueryStatement(args.req, function (err, result) {
      var result_obj;
      if ((err === null || typeof err === 'undefined')) {
        result_obj = new IClientRPCService_executeQueryStatement_result((err !== null || typeof err === 'undefined') ? err : {success: result});
        output.writeMessageBegin("executeQueryStatement", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("executeQueryStatement", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};
IClientRPCServiceProcessor.prototype.process_requestStatementId = function(seqid, input, output) {
  var args = new IClientRPCService_requestStatementId_args();
  args[Symbol.for("read")](input);
  input.readMessageEnd();
  if (this._handler.requestStatementId.length === 1) {
    Q.fcall(this._handler.requestStatementId.bind(this._handler),
      args.sessionId
    ).then(function(result) {
      var result_obj = new IClientRPCService_requestStatementId_result({success: result});
      output.writeMessageBegin("requestStatementId", Thrift.MessageType.REPLY, seqid);
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    }).catch(function (err) {
      var result;
      result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
      output.writeMessageBegin("requestStatementId", Thrift.MessageType.EXCEPTION, seqid);
      result[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  } else {
    this._handler.requestStatementId(args.sessionId, function (err, result) {
      var result_obj;
      if ((err === null || typeof err === 'undefined')) {
        result_obj = new IClientRPCService_requestStatementId_result((err !== null || typeof err === 'undefined') ? err : {success: result});
        output.writeMessageBegin("requestStatementId", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("requestStatementId", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};
IClientRPCServiceProcessor.prototype.process_insertRecord = function(seqid, input, output) {
  var args = new IClientRPCService_insertRecord_args();
  args[Symbol.for("read")](input);
  input.readMessageEnd();
  if (this._handler.insertRecord.length === 1) {
    Q.fcall(this._handler.insertRecord.bind(this._handler),
      args.req
    ).then(function(result) {
      var result_obj = new IClientRPCService_insertRecord_result({success: result});
      output.writeMessageBegin("insertRecord", Thrift.MessageType.REPLY, seqid);
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    }).catch(function (err) {
      var result;
      result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
      output.writeMessageBegin("insertRecord", Thrift.MessageType.EXCEPTION, seqid);
      result[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  } else {
    this._handler.insertRecord(args.req, function (err, result) {
      var result_obj;
      if ((err === null || typeof err === 'undefined')) {
        result_obj = new IClientRPCService_insertRecord_result((err !== null || typeof err === 'undefined') ? err : {success: result});
        output.writeMessageBegin("insertRecord", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("insertRecord", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj[Symbol.for("write")](output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};
