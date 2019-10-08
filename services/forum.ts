import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';

import { ConfigService } from "./config";

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class ForumService {



	all_forums: any = [];
	all_topics: any = [];
	all_replies: any = [];
	my_batches: any = [];
	my_topics: any = [];
	my_replies: any = [];
	constructor(
		private http: Http,
		public config: ConfigService,
		public storage: Storage
	) { }



	get_all_forums(action, args) {

		let $this = this;
		let data = args;
		return new Promise((resolve) => {
			switch (action) {
				case 'refresh':
					$this.all_forums = [];
					$this.storage.remove('allforums').then((x) => {
						$this.get_forums(data, action).then((res) => {
							resolve(res);
						});
					});
					break;
				case 'ngoninit':
					$this.all_forums = [];
					$this.storage.get('allforums').then((allforums) => {
						if (allforums && Array.isArray(allforums) && allforums.length) {
							$this.all_forums = allforums;
							resolve(allforums);
						} else {
							$this.get_forums(data, action).then((res) => {
								resolve(res);
							});
						}
					});
					break;
				case 'infinite':
					if ($this.all_forums && Array.isArray($this.all_forums) && $this.all_forums.length) {
						data.paged = ($this.all_forums.length / $this.config.forum.limit) + 1;
						console.log('paged=== ' + data.paged);
						$this.get_forums(data, action).then((res) => {
							resolve(res);
						});
					}
					break;
				case 'sort':
					$this.all_forums = [];
					$this.get_forums(data, action).then((res) => {
						resolve(res);
					});
					break;
				case 'search':
					$this.all_forums = [];
					$this.get_forums(data, action).then((res) => {
						resolve(res);
					});
					break;
				case 'filterby':
					$this.all_forums = [];
					data = {
						'limit': $this.config.forum.limit,
						'offset': 0,
						'args': args
					};
					$this.get_forums(data, action).then((res) => {
						resolve(res);
					});
					break;
				default:
			}
		});
	}


	get_forums(data, action) {
		let $this = this;
		return new Promise((resolve) => {
			if ($this.config.isLoggedIn) {
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}user/forums`, data, opt)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray(res.data) && res.data.length) {
								res.data.map((x, i) => {
									if (Array.isArray($this.all_forums)) {
										if ($this.all_forums.length) {
											$this.all_forums.push(x);
										} else {
											$this.all_forums = [];
											$this.all_forums.push(x);
										}
									}
								});
							}
						} else {
							//$this.all_forums = [];
						}
						if (action == 'refresh' || action == 'ngoninit') {
							if (Array.isArray($this.all_forums) && $this.all_forums.length) {
								$this.storage.set('allforums', $this.all_forums);
								// $this.config.addToTracker('allforums', parseInt($this.all_forums.length));
							}
						}
						console.log('this.allforums');
						console.log($this.all_forums);
						resolve(res.data);
					});
			} else {
				$this.http.post(`${$this.config.baseUrl}user/forums`, data)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray(res.data) && res.data.length) {
								res.data.map((x, i) => {
									if (Array.isArray($this.all_forums)) {
										if ($this.all_forums.length) {
											$this.all_forums.push(x);
										} else {
											$this.all_forums = [];
											$this.all_forums.push(x);
										}
									}
								});
							}
						} else {
							// $this.all_forums = [];
						}
						if (action == 'refresh' || action == 'ngoninit') {
							if (Array.isArray($this.all_forums) && $this.all_forums.length) {
								$this.storage.set('allforums', $this.all_forums);
								// $this.config.addToTracker('allforums', parseInt($this.all_forums.length));
							}
						}
						console.log('this.allforums');
						console.log($this.all_forums);
						resolve(res.data);
					});
			}
		});
	}

	get_all_topics(action, args) {

		let $this = this;
		let data = args;
		let forum_id = args.post_parent;
		return new Promise((resolve) => {
			switch (action) {
				case 'refresh':
					$this.all_topics = [];
					$this.storage.remove('alltopics_' + forum_id).then((x) => {
						$this.get_topics(data, action).then((res) => {
							resolve(res);
						});
					});
					break;
				case 'ngoninit':
					$this.all_topics = [];
					$this.storage.get('alltopics_' + forum_id).then((alltopics) => {
						if (alltopics && Array.isArray(alltopics) && alltopics.length) {
							$this.all_topics = alltopics;
							resolve(alltopics);
						} else {
							$this.get_topics(data, action).then((res) => {
								resolve(res);
							});
						}
					});
					break;
				case 'infinite':
					if ($this.all_topics && Array.isArray($this.all_topics) && $this.all_topics.length) {
						data.paged = ($this.all_topics.length / $this.config.forum.limit) + 1;
						console.log('paged=== ' + data.paged);
						$this.get_topics(data, action).then((res) => {
							resolve(res);
						});
					}
					break;
				case 'sort':
					$this.all_topics = [];
					$this.get_topics(data, action).then((res) => {
						resolve(res);
					});
					break;
				case 'search':
					$this.all_topics = [];
					$this.get_topics(data, action).then((res) => {
						resolve(res);
					});
					break;
				case 'filterby':
					$this.all_topics = [];
					data = {
						'limit': $this.config.forum.limit,
						'offset': 0,
						'args': args
					};
					$this.get_topics(data, action).then((res) => {
						resolve(res);
					});
					break;
				default:
			}
		});
	}


	get_topics(data, action) {
		let $this = this;
		let forum_id = data.post_parent;
		return new Promise((resolve) => {
			if ($this.config.isLoggedIn) {
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}user/topics`, data, opt)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray(res.data) && res.data.length) {
								res.data.map((x, i) => {
									if (Array.isArray($this.all_topics)) {
										if ($this.all_topics.length) {
											$this.all_topics.push(x);
										} else {
											$this.all_topics = [];
											$this.all_topics.push(x);
										}
									}
								});
							}
						} else {
							// do nothing
							//$this.all_topics = [];
						}
						if (action == 'refresh' || action == 'ngoninit') {
							if (Array.isArray($this.all_topics) && $this.all_topics.length) {
								$this.storage.set('alltopics_' + forum_id, $this.all_topics);
								// $this.config.addToTracker('alltopics_'+forum_id, parseInt($this.all_topics.length));
							}
						}
						console.log('this.alltopics');
						console.log($this.all_topics);
						resolve(res.data);
					});
			} else {
				$this.http.post(`${$this.config.baseUrl}user/topics`, data)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray(res.data) && res.data.length) {
								res.data.map((x, i) => {
									if (Array.isArray($this.all_topics)) {
										if ($this.all_topics.length) {
											$this.all_topics.push(x);
										} else {
											$this.all_topics = [];
											$this.all_topics.push(x);
										}
									}
								});
							}
						} else {
							// do nothing
							//$this.all_topics = [];
						}
						if (action == 'refresh' || action == 'ngoninit') {
							if (Array.isArray($this.all_topics) && $this.all_topics.length) {
								$this.storage.set('alltopics_' + forum_id, $this.all_topics);
								// $this.config.addToTracker('alltopics_'+forum_id, parseInt($this.all_topics.length));
							}
						}
						console.log('this.alltopics');
						console.log($this.all_topics);
						resolve(res.data);
					});
			}
		});
	}

	get_all_replies(action, args) {
		let $this = this;
		let data = args;
		let topic_id = args.post_parent;
		return new Promise((resolve) => {
			switch (action) {
				case 'refresh':
					$this.all_replies = [];
					$this.storage.remove('allreplies_' + topic_id).then((x) => {
						$this.get_replies(data, action).then((res) => {
							resolve(res);
						});
					});
					break;
				case 'ngoninit':
					$this.all_replies = [];
					$this.storage.get('allreplies_' + topic_id).then((allreplies) => {
						if (allreplies && Array.isArray(allreplies) && allreplies.length) {
							$this.all_replies = allreplies;
							resolve(allreplies);
						} else {
							$this.get_replies(data, action).then((res) => {
								resolve(res);
							});
						}
					});
					break;
				case 'infinite':
					if ($this.all_replies && Array.isArray($this.all_replies) && $this.all_replies.length) {
						data.paged = ($this.all_replies.length / $this.config.forum.limit) + 1;
						console.log('paged=== ' + data.paged);
						$this.get_replies(data, action).then((res) => {
							resolve(res);
						});
					}
					break;
				case 'sort':
					$this.all_replies = [];
					$this.get_replies(data, action).then((res) => {
						resolve(res);
					});
					break;
				case 'search':
					$this.all_replies = [];
					$this.get_replies(data, action).then((res) => {
						resolve(res);
					});
					break;
				case 'filterby':
					$this.all_replies = [];
					data = {
						'limit': $this.config.forum.limit,
						'offset': 0,
						'args': args
					};
					$this.get_replies(data, action).then((res) => {
						resolve(res);
					});
					break;
				default:
			}
		});
	}


	get_replies(data, action) {
		let $this = this;
		let topic_id = data.post_parent;
		return new Promise((resolve) => {
			if ($this.config.isLoggedIn) {
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}user/replies`, data, opt)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray(res.data) && res.data.length) {
								res.data.map((x, i) => {
									if (Array.isArray($this.all_replies)) {
										if ($this.all_replies.length) {
											// just to not added element which is firest reply of topic 
											if (x.ID != topic_id) {
												$this.all_replies.unshift(x);
											}
										} else {
											$this.all_replies = [];
											if (x.ID != topic_id) {
												$this.all_replies.unshift(x);
											}
										}
									}
								});
							}
						} else {
							// $this.all_replies = [];
						}
						if (action == 'refresh' || action == 'ngoninit') {
							if (Array.isArray($this.all_replies) && $this.all_replies.length) {
								$this.storage.set('allreplies_' + topic_id, $this.all_replies);
								// $this.config.addToTracker('allreplies_'+topic_id, parseInt($this.all_replies.length));
							}
						}
						console.log('this.allreplies');
						console.log($this.all_replies);
						resolve(res.data);
					});
			} else {
				$this.http.post(`${$this.config.baseUrl}user/replies`, data)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray(res.data) && res.data.length) {
								res.data.map((x, i) => {
									if (Array.isArray($this.all_replies)) {
										if ($this.all_replies.length) {
											if (x.ID != topic_id) {
												$this.all_replies.unshift(x);
											}
										} else {
											$this.all_replies = [];
											if (x.ID != topic_id) {
												$this.all_replies.unshift(x);
											}
										}
									}
								});
							}
						} else {
							// $this.all_replies = [];
						}
						if (action == 'refresh' || action == 'ngoninit') {
							if (Array.isArray($this.all_replies) && $this.all_replies.length) {
								$this.storage.set('allreplies_' + topic_id, $this.all_replies);
								// $this.config.addToTracker('allreplies_'+topic_id, parseInt($this.all_replies.length));
							}
						}
						console.log('this.allreplies');
						console.log($this.all_replies);
						resolve(res.data);
					});
			}
		});
	}

	/*
	create topic format response
		res = {										
			"status": 1,
			"data": 7238,
			"message": "Topic Created"
		}
	*/
	create_topic(data: any) {
		let $this = this;
		console.log(data);
		return new Promise((resolve) => {
			if ($this.config.isLoggedIn) {
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}user/topics/create`, data, opt)
					.map(res => res.json())
					.subscribe(res => {
						console.log(res);
						resolve(res);
					});
			}
		});
	}

	/*
	create reply format response
		{
			"status": 1,
			"data": 7358,
			"message": "Reply Created"
		}
	*/
	create_reply(data: any) {
		let $this = this;
		console.log(data);
		return new Promise((resolve) => {
			if ($this.config.isLoggedIn) {
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}user/replies/create`, data, opt)
					.map(res => res.json())
					.subscribe(res => {
						console.log(res);
						if (res.status) {
							if (res.data) {
								$this.all_replies.push(res.data);
							}
						}
						resolve(res);
					});
			}
		});
	}

	deletereply(reply: any) {
		let $this = this;
		return new Promise(((resolve) => {
			if ($this.config.isLoggedIn) {
				let reply_id = reply.ID;
				let topic_id = reply.post_parent;
				let data = {
					'reply_id': reply_id,
					'sub_action': 'trash'
				};
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}user/replies/delete`, data, opt)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray($this.all_replies) && $this.all_replies.length) {
								let index = $this.all_replies.findIndex((el) => {
									return el.ID == reply_id
								});
								if (index > -1) {
									$this.all_replies.splice(index, 1);
									$this.storage.set('allreplies_' + topic_id, $this.all_replies);
								}

							}
						}
						console.log(res);
						resolve(res);
					});
			}
		}));
	}

	editreply(reply: any, new_content) {
		let $this = this;
		return new Promise(((resolve) => {
			if ($this.config.isLoggedIn) {
				let reply_id = reply.ID;
				let topic_id = reply.post_parent;
				let data = {
					'reply_id': reply.ID,
					'new_content': new_content
				};
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}user/replies/update`, data, opt)
					.map(res => res.json())
					.subscribe(res => {
						if (res.status) {
							if (Array.isArray($this.all_replies) && $this.all_replies.length) {
								let index = $this.all_replies.findIndex((el) => {
									return el.ID == reply_id
								});
								if (index > -1) {
									$this.all_replies[index] = res.data;
									$this.storage.set('allreplies_' + topic_id, $this.all_replies);
								}

							}
						}
						console.log(res);
						resolve(res);
					});
			}
		}));
	}

	get_my_topics(res: any, paged) {
		console.log(res);
		let $this = this;
		if (paged == 1) {
			$this.my_topics = [];
		}
		res = res.data;
		if (res.status) {
			if (Array.isArray(res.data) && res.data.length) {
				res.data.map((x, i) => {
					if (Array.isArray($this.my_topics)) {
						if ($this.my_topics.length) {
							$this.my_topics.push(x);
						} else {
							$this.my_topics = [];
							$this.my_topics.push(x);
						}
					} else {
						console.log('not array');
					}
				});
			}
		} else {
		}
		console.log('this.my_topics');
		console.log($this.my_topics);
	}

	get_my_replies(res: any, paged) {
		console.log(res);
		let $this = this;
		if (paged == 1) {
			$this.my_replies = [];
		}
		res = res.data;
		if (res.status) {
			if (Array.isArray(res.data) && res.data.length) {
				res.data.map((x, i) => {
					if (Array.isArray($this.my_replies)) {
						if ($this.my_replies.length) {
							$this.my_replies.push(x);
						} else {
							$this.my_replies = [];
							$this.my_replies.push(x);
						}
					} else {
						console.log('not array');
					}
				});
			}
		} else {
		}
		console.log('this.my_replies');
		console.log($this.my_replies);
	}


	public getUserAuthorizationHeaders() {
		var userheaders = new Headers();
		userheaders.append('Authorization', this.config.settings.access_token);
		return new RequestOptions({ headers: userheaders });
	}


}



